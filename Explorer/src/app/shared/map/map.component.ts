import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges,OnDestroy } from '@angular/core';
import { MapService } from './map.service';
import * as L from 'leaflet';
import { Input } from '@angular/core';
import { Object } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit,OnDestroy {
  map: any;
  private markers: L.Marker[] = [];

  @Input() clearMarkersTrigger: boolean = false;
  @Input() objectCollection: Object[] | null = null;
  //@Input() checkpointCollection: any[] | null = null;
  @Input() checkpointObjectCollection: any[] | null = null;
  @Input() checkpointCordinatesCollection: any[] | null = null;
  @Input() checkpointCollection: Checkpoint[] | null = null;
  @Input() editing: boolean = false;
  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Output() markerClicked = new EventEmitter<[number, number]>();
  @Input() touristPosition: { latitude: number, longitude: number } | null = null;
  @Input() isClickDisabled: boolean = false;  
  private routingControl: L.Routing.Control | null = null;  

  constructor(private mapService: MapService) {}

  private loadObjects(): void {

    let restaurantIcon = {
      imagePath: 'https://cdn-icons-png.flaticon.com/512/8503/8503966.png',
      
    };
    
    let wcIcon = {
      imagePath: 'https://cdn-icons-png.flaticon.com/512/7491/7491370.png',
     
    };
    
    let parkingIcon = {
      imagePath: 'https://cdn-icons-png.flaticon.com/512/15561/15561506.png',
    
    };

 
    if (this.objectCollection != null){
      this.objectCollection.forEach(element => {
        let icon;
        switch (element.category) {
          case 'Restaurant':
            icon = restaurantIcon;
            break;
          case 'WC':
            icon = wcIcon;
            break;
          case 'Parking':
            icon = parkingIcon;
            break;
          default:
            icon = restaurantIcon;
            break;
        }
        var customIcon = L.icon({
          iconUrl: icon.imagePath,
          iconSize: [30, 30], 
          iconAnchor: [15, 15], 
          popupAnchor: [0, -15] 
        });
        var markerOptions = {
          icon: customIcon,
          draggable: false
        }

        const mp = new L.Marker([element.latitude, element.longitude],markerOptions).addTo(this.map).bindPopup(`<div style="width: 200px">
          <h2 style="margin: 0;">${element.name}</h2>
          <p>${element.description || 'No description available.'}</p>
          <img src="data:${element.image?.mimeType};base64,${element.image?.data}" 
              alt="Checkpoint Image" 
              class="checkpoint-image" 
              style="width: 200px; max-height: 150px;">
        </div>`).openPopup();;
      });
    }
  }

  private loadCheckpoints(): void{
    if (this.checkpointCollection != null) {
      this.checkpointCollection.forEach(element => {
        //const mp = new L.Marker([element.latitude, element.longitude],{draggable: false, title : element.name}).addTo(this.map).bindPopup("<h1>"+element.name+"</h1>");
       // console.log(mp.getLatLng());
      })
    }
    this.setRoute();

  }
  
  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    setTimeout(() => {
      this.initMap();
    }, 0);  // Delay to ensure the DOM is fully ready  }
  }
  private initMap(): void {

    if (this.map) {
      this.map.remove(); // Ensures that the previous map is fully removed
      this.map = undefined; // Clear the reference
    }

    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    this.loadObjects();
    this.loadCheckpoints();
    tiles.addTo(this.map);
    this.registerOnClick();
  }

  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {

    if (this.isClickDisabled) {
      return;
    }

    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      });

      this.locationSelected.emit({ lat, lng });
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      if(this.editing){
        mp.on('click', (event) => {
          const latLng = event.latlng; // Get latitude and longitude
          //console.log('Latitude:', latLng.lat, 'Longitude:', latLng.lng);
          this.markerClicked.emit([latLng.lat, latLng.lng])
        });
      }
      this.markers.push(mp);
      //alert(mp.getLatLng());
    });
  }
  clearMarkers(): void {
    if (this.markers && this.markers.length > 0) {
        this.markers.forEach(marker => {
            if (this.map.hasLayer(marker)) {
                this.map.removeLayer(marker);
            }
        });
        this.markers = [];  
        if (this.routingControl) {
          this.map.removeControl(this.routingControl);  
          this.routingControl = null;  
        }
        this.markersCleared.emit();
    }
}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.markers.length == 0){
      if (changes['touristPosition'] && changes['touristPosition'].currentValue) {
        this.addTouristMarker(changes['touristPosition'].currentValue);
      }
    }
    if (changes['objectCollection'] && changes['objectCollection'].currentValue) {
      this.loadObjects();
    }
    //if (changes['checkpointCollection'] && changes['checkpointCollection'].currentValue) {
      //this.loadCheckpoints();
    //}
    if (changes['clearMarkersTrigger'] && changes['clearMarkersTrigger'].currentValue) {
      this.clearMarkers();
    }
    if (changes['checkpointObjectCollection'] && changes['checkpointObjectCollection'].currentValue) {
      this.loadCheckpoints();
    }
    if (changes['checkpointCordinatesCollection'] && changes['checkpointCordinatesCollection'].currentValue) {
      this.clearMarkers();
      this.setExecutionRoutes();
    }
  }

  private touristMarker: L.Marker | null = null; 


  private addTouristMarker(position: { latitude: number, longitude: number }): void {
    if (this.touristMarker) {
      // Promenite samo poziciju markera, zadrži custom ikonu
      this.touristMarker.setLatLng([position.latitude, position.longitude]);
    } else {
      // Kreiraj marker sa custom ikonom
      this.touristMarker = L.marker([position.latitude, position.longitude], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/15561/15561506.png',
          iconSize: [30, 30], 
          iconAnchor: [15, 15], 
          popupAnchor: [0, -15]
        })
      }).addTo(this.map)
        .bindPopup('Current Tourist Position')
        .openPopup();
      this.markers.push(this.touristMarker);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); 
      this.map = undefined; 
    }
  }
  
  private setExecutionRoutes(): void {
    if (this.checkpointCordinatesCollection && this.checkpointCordinatesCollection.length > 1) {
      const checkpoints = this.checkpointCordinatesCollection;
      
      const markers = checkpoints.map((checkpoint: Checkpoint) => {
        const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
          title: checkpoint.name,
          draggable: false,
        }).addTo(this.map);
        return marker;
      });
      this.markers.push(...markers);
      const waypoints = markers.map((marker : L.Marker) => marker.getLatLng());
      const plan = new L.Routing.Plan(waypoints, {
        createMarker: (i, waypoint, n) => {
          const marker = L.marker(waypoint.latLng, {
            draggable: false, 
            title: checkpoints[i]?.name || `Waypoint ${i + 1}`,
          });
          //console.log("Testerina", marker);
          this.markers.push(marker);
          marker.bindPopup(`<div style="width: 200px">
            <h2 style="margin: 0;">${checkpoints[i].name}</h2>
            <p>${checkpoints[i].description || 'No description available.'}</p>
            <img src="data:${checkpoints[i].image?.mimeType};base64,${checkpoints[i].image?.data}" 
                alt="Checkpoint Image" 
                class="checkpoint-image" 
                style="width: 200px; max-height: 150px;">
          </div>`).openPopup(); 
          return marker;
        },
        draggableWaypoints: false,
      });      
      this.routingControl = L.Routing.control({
        plan: plan,
        routeWhileDragging: false,
        useZoomParameter: true,
        addWaypoints: false,
        router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', { profile: 'mapbox/driving' })
      }).addTo(this.map);
    }
  }

  setRoute(): void {
    if (this.checkpointObjectCollection) {
      this.checkpointObjectCollection.forEach(tour => {
        const checkpoints = tour.checkpoints || []; 
        if (checkpoints.length > 1) {
          const markers = checkpoints.map((checkpoint: Checkpoint) => {
            //console.log(checkpoint);
            const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
              title: checkpoint.name,
              draggable: false,
            }).addTo(this.map)
            return marker;
          });
            

          const waypoints = markers.map((marker : L.Marker) => marker.getLatLng());
          
          const plan = new L.Routing.Plan(waypoints, {
            createMarker: (i, waypoint, n) => {
              const marker = L.marker(waypoint.latLng, {
                draggable: false, 
                title: checkpoints[i]?.name || `Waypoint ${i + 1}`,
              });
              marker.bindPopup(`<div style="width: 200px">
                <h2 style="margin: 0;">${checkpoints[i].name}</h2>
                <p>${checkpoints[i].description || 'No description available.'}</p>
                <img src="data:${checkpoints[i].image?.mimeType};base64,${checkpoints[i].image?.data}" 
                    alt="Checkpoint Image" 
                    class="checkpoint-image" 
                    style="width: 200px; max-height: 150px;">
              </div>`).openPopup(); 
              return marker;
            },
            draggableWaypoints: false,
          });
          
          L.Routing.control({
            plan: plan,
            routeWhileDragging: false,
            useZoomParameter: true,
            addWaypoints: false,
            router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', { profile: 'mapbox/driving' }),
          }).addTo(this.map);
        }
      });
    }
  }  
}
