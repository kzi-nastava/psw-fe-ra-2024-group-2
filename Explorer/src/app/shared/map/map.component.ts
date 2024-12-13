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
  forecastData: any[] = [];

  @Input() clearMarkersTrigger: boolean = false;
  @Input() objectCollection: Object[] | null = null;
  @Input() addedCheckpointCollection: any[] | null = null;
  @Input() checkpointObjectCollection: any[] | null = null;
  @Input() checkpointCordinatesCollection: any[] | null = null;
  @Input() checkpointCollection: any[] | null = null;
  @Input() eventsCollection: any[] | null = null;
  @Input() editing: boolean = false;
  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Output() markerClicked = new EventEmitter<[number, number]>();
  @Output() checkpointRemoved = new EventEmitter<number>(); // EventEmitter for checkpoint removal
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

  loadAddedCheckpoints(): void{
    if (this.addedCheckpointCollection != null) {
      // Add route logic here when there are at least 2 checkpoints
      this.addRouteToMap();
    }
  }

  private addRouteToMap(): void {
    if (this.addedCheckpointCollection) {
    // Clear existing map layers and controls
    this.map.eachLayer((layer: L.Layer) => {
      if (!(layer instanceof L.TileLayer)) { // Keep the base tile layer
        this.map.removeLayer(layer);
      }
    });

    // Remove any existing routing control
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    const checkpoints = this.addedCheckpointCollection;
    const markers = checkpoints.map((checkpoint: Checkpoint) => {
      const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
        title: checkpoint.name,
        draggable: false,
      })
      .addTo(this.map);
      return marker;
    });
    this.markers.push(...markers);
    if(this.addedCheckpointCollection.length >= 1){
    const waypoints = markers.map((marker: L.Marker) => {
      // Set opacity to 0.0 for all markers (waypoints)
      marker.setOpacity(0.0);
      return marker.getLatLng();
    });
    const plan = new L.Routing.Plan(waypoints, {
      createMarker: (i, waypoint, n) => {
        const marker = L.marker(waypoint.latLng,{
          draggable: false, 
          title: checkpoints[i]?.name || `Waypoint ${i + 1}`,
        });
        //console.log("Testerina", marker);
        this.markers.push(marker);
        marker.bindPopup(`<div style="width: 200px">
          <h2 style="margin: 0;">${checkpoints[i].name}</h2>
          <img src="data:${checkpoints[i].image?.mimeType};base64,${checkpoints[i].image?.data}" 
                    alt="Checkpoint Image" 
                    class="checkpoint-image" 
                    style="width: 200px; max-height: 150px;">
          <button class="mat-button" type="button" data-index="${i}" style="margin-top: 10px;">Remove</button>
        </div>`).openPopup();
        // Add event listener to the "Remove" button inside the popup
        marker.on('popupopen', () => {
          const removeButton = document.querySelector(`button[data-index="${i}"]`);
          if (removeButton) {
            removeButton.addEventListener('click', (e) => {
              this.checkpointRemoved.emit(i); // Emit the checkpoint index
                this.map.removeLayer(marker); // Remove the marker from the map
                marker.closePopup(); // Close the popup after removal
            });
          }
        });
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


    // Hide the directions box
    const itineraryElement = document.querySelector('.leaflet-routing-container');
    if (itineraryElement) {
      itineraryElement.setAttribute('style', 'display: none;');
    }
    }
    }
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
    this.loadEvents();
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
    if (changes['addedCheckpointCollection'] && !changes['addedCheckpointCollection'].firstChange) {
      // Remove existing markers from the map
      if(this.markers.length > 1) {
        this.clearMarkers();
        //console.log("OBRISANI");
      }
      this.loadAddedCheckpoints(); // Update route when checkpointCollection changes
    }
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
    if (changes['eventsCollection'] && changes['eventsCollection'].currentValue) {
      this.loadEvents();
    }
  }

  private loadEvents(): void {
    //console.log("Kolekcija",this.eventsCollection); 
    if (this.eventsCollection) {
      this.eventsCollection.forEach(event => {
        const mp = new L.Marker([event.latitude, event.longitude]).addTo(this.map).bindPopup(`<div style="width: 200px">
          <h2 style="margin: 0;">${event.name}</h2>
          <p>${event.description || 'No description available.'}</p>
          <img src="data:${event.image?.mimeType};base64,${event.image?.data}" 
              alt="Checkpoint Image" 
              class="checkpoint-image" 
              style="width: 200px; max-height: 150px;">
        </div>`).openPopup();;
        });
      }
    }
  private touristMarker: L.Marker | null = null; 


  private addTouristMarker(position: { latitude: number, longitude: number }): void {
    if (this.touristMarker) {
      // Promenite samo poziciju markera, zadrži custom ikonu
      this.touristMarker.setLatLng([position.latitude, position.longitude]);
    } else {
      // Kreiraj marker sa custom ikonom
      this.touristMarker = L.marker([position.latitude, position.longitude]).addTo(this.map)
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

      //console.log(checkpoints);
      const markers = checkpoints.map((checkpoint: Checkpoint) => {
        const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
          title: checkpoint.name,
          draggable: false,
        }).addTo(this.map);
        return marker;
      });
      this.markers.push(...markers);
      const waypoints = markers.map((marker: L.Marker) => {
        // Set opacity to 0.0 for all markers (waypoints)
        marker.setOpacity(0.0);
        return marker.getLatLng();
      });      
      const plan = new L.Routing.Plan(waypoints, {
        createMarker: (i, waypoint, n) => {

          if(i === 0) {
            //console.log("Start");
            const marker = L.marker(waypoint.latLng, {icon : L.icon({iconUrl : 'https://static.thenounproject.com/png/4415238-200.png',
            iconSize: [50, 50],
            iconAnchor: [15, 15],
            })} ).addTo(this.map).bindPopup(`<div style="width: 200px">
            <h2 style="margin: 0;">${checkpoints[i].name} ${checkpoints[i].surname}</h2>
            <img src="https://img.redbull.com/images/c_fill,g_auto,w_1200,h_630/f_auto,q_auto/redbullcom/2015/01/29/1331702269907_2/bogdan-lalovi%C4%87.jpg" 
                alt="Checkpoint Image" 
                class="checkpoint-image" 
                style="width: 200px; max-height: 150px;">
          </div>`);
              

            this.markers.push(marker);
            return marker;
          }
          

          const marker = L.marker(waypoint.latLng,{
            draggable: false, 
            title: checkpoints[i]?.name || `Waypoint ${i + 1}`,
          });
          //console.log("Testerina", marker);         
          this.markers.push(marker);
          const popupContent = `<div style="width: 200px">
  <h2 style="margin: 0;">${checkpoints[i].name}</h2>
  <p>${checkpoints[i].description || 'No description available.'}</p>
  <img src="data:${checkpoints[i].image?.mimeType};base64,${checkpoints[i].image?.data}" 
      alt="Checkpoint Image" 
      class="checkpoint-image" 
      style="width: 200px; max-height: 150px;">
  <p><strong>Loading weather data...</strong></p>
</div>`;

marker.bindPopup(popupContent).openPopup();

// Kada se podaci o vremenskoj prognozi dobiju, ažuriraj pop-up
this.mapService.getWeatherForecastByDay(checkpoints[i].latitude, checkpoints[i].longitude)
  .subscribe(weatherData => {
    const weatherContent = this.getWeatherInfoForPopup(weatherData);
    const updatedPopupContent = `<div style="width: 200px">
      <h2 style="margin: 0;">${checkpoints[i].name}</h2>
      <p>${checkpoints[i].description || 'No description available.'}</p>
      <img src="data:${checkpoints[i].image?.mimeType};base64,${checkpoints[i].image?.data}" 
          alt="Checkpoint Image" 
          class="checkpoint-image" 
          style="width: 200px; max-height: 150px;">
      ${weatherContent}
    </div>`;

    const popup = marker.getPopup(); // Dobij popup
    if (popup) {
      popup.setContent(updatedPopupContent).update(); // Ažuriraj sadržaj samo ako postoji
    } else {
      console.error('Popup is undefined for the marker.');
    }
  });
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

  showWeatherAlert() {
    alert("Weather forecast clicked!");
  }
  
  private getWeatherInfoForPopup(weatherData: any): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
  
    const forecast = weatherData.forecast.forecastday.map((day: any) => {
      const forecastDate = new Date(day.date); // Datum vremenske prognoze
      let dateLabel = day.date; // Podrazumevani datum (kao tekst)
  
      // Postavljanje oznake za Today, Tomorrow i Day After Tomorrow
      if (
        forecastDate.getFullYear() === today.getFullYear() &&
        forecastDate.getMonth() === today.getMonth() &&
        forecastDate.getDate() === today.getDate()
      ) {
        dateLabel = 'Today';
      } else if (
        forecastDate.getFullYear() === tomorrow.getFullYear() &&
        forecastDate.getMonth() === tomorrow.getMonth() &&
        forecastDate.getDate() === tomorrow.getDate()
      ) {
        dateLabel = 'Tomorrow';
      } else if (
        forecastDate.getFullYear() === dayAfterTomorrow.getFullYear() &&
        forecastDate.getMonth() === dayAfterTomorrow.getMonth() &&
        forecastDate.getDate() === dayAfterTomorrow.getDate()
      ) {
        dateLabel = 'Day After Tomorrow';
      }
  
      return `
        <div style="display: flex; align-items: center; margin-bottom: 10px; border-bottom: ${dateLabel === 'Day After Tomorrow' ? 'none' : '1px solid #ccc'}; padding: 10px 0 0 0;">
          <div style="flex: 1; min-width: 70px; text-align: center;">
            <strong>${dateLabel}</strong>
          </div>
          <div style="flex: 1; width: 30px; text-align: center;">
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 30px; height: 30px;" />
          </div>
          <div style="flex: 1; width: 30px; margin-left: 3px; text-align: center;" title="Max temp.">
            ${day.day.maxtemp_c}°
          </div>
          <div style="flex: 1; width: 30px; margin-left: 3px; text-align: center;" title="Min temp.">
            ${day.day.mintemp_c}°
          </div>
          <div style="flex: 1; width: 30px; margin-left: 2px; text-align: center;">
            <span style="font-size: 0.8em; vertical-align: middle;">💧</span> ${day.day.daily_chance_of_rain || '0'}%
          </div>
        </div>
      `;
    }).join('');
  
    return `
    <fieldset style="border: 2px solid #ccc; padding: 0px; margin: 10px 0;">
  <legend style="font-weight: bold; font-size: 1.2em; text-align: center;">Weather Forecast</legend>
  ${forecast}
</fieldset>

    `;
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