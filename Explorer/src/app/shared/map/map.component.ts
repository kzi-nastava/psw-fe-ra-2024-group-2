import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
  private map: any;
  private markers: L.Marker[] = [];

  @Input() clearMarkersTrigger: boolean = false;
  @Input() objectCollection: Object[] | null = null;
  @Input() checkpointCollection: any[] | null = null;
  @Input() checkpointObjectCollection: any[] | null = null;

  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

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
          draggable: true
        }

        const mp = new L.Marker([element.latitude, element.longitude],markerOptions).addTo(this.map);
      });
    }
  }

  private loadCheckpoints(): void{
    if (this.checkpointCollection != null) {
      this.checkpointCollection.forEach(element => {
        const mp = new L.Marker([element.latitude, element.longitude]).addTo(this.map);
      })
    }
    this.setRoute();

  }
  

  private initMap(): void {
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
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      });

      this.locationSelected.emit({ lat, lng });
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      this.markers.push(mp);
      alert(mp.getLatLng());
    });
  }
  clearMarkers(): void {
    if (this.markers && this.markers.length > 0) {
        this.markers.forEach(marker => {
            if (this.map.hasLayer(marker)) {
                this.map.removeLayer(marker);
            }
        });
        this.markers = [];  // Clear the markers array
        // Notify the parent that markers have been cleared
        this.markersCleared.emit();
    }
}

  // Watch for changes in `clearMarkersTrigger` to trigger marker clearing
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['objectCollection'] && changes['objectCollection'].currentValue) {
      this.loadObjects();
    }
    if (changes['checkpointCollection'] && changes['checkpointCollection'].currentValue) {
      this.loadCheckpoints();
    }
    if (changes['clearMarkersTrigger'] && changes['clearMarkersTrigger'].currentValue) {
      this.clearMarkers();
    }
    if (changes['checkpointObjectCollection'] && changes['checkpointObjectCollection'].currentValue) {
      this.loadCheckpoints();
      console.log(this.checkpointObjectCollection);
    }
  }
  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }
  setRoute(): void {
    if (this.checkpointObjectCollection) {
      this.checkpointObjectCollection.forEach(tour => {
        const checkpoints = tour.checkpoints || []; 
        if (checkpoints.length > 1) {
          const waypoints = checkpoints.map((checkpoint : Checkpoint) => 
            L.latLng(checkpoint.latitude, checkpoint.longitude)
          );
          const routeControl = L.Routing.control({
            waypoints: waypoints,
            router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', {profile: 'mapbox/driving'}),
            routeWhileDragging: true 
          }).addTo(this.map);     
  
        } 
      });
    } 
  }
  
  

}
