import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges,OnDestroy } from '@angular/core';
import { EncounterMapService } from './map-encounter.service';
import * as L from 'leaflet';
import { Input } from '@angular/core';
@Component({
  selector: 'xp-map-encounter',
  templateUrl: './map-encounter.component.html',
  styleUrls: ['./map-encounter.component.css']
})
export class MapEncounterComponent implements AfterViewInit, OnDestroy {
  map: any;
  private markers: L.Marker[] = [];

  @Output() markerClicked = new EventEmitter<[number, number]>();
  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Input() clearMarkersTrigger: boolean = false;
  @Input() touristPosition: { latitude: number, longitude: number } | null = null;
  @Input() isClickDisabled: boolean = false;
  @Input() editing: boolean = false;

  private routingControl: L.Routing.Control | null = null;  
  private marker: L.Marker | null = null; 

  constructor(private mapService: EncounterMapService) {}

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
    tiles.addTo(this.map);
    this.registerOnClick();
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
       // Remove the existing marker if present
       if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Add the new marker
      this.marker = new L.Marker([lat, lng]).addTo(this.map)
      if (this.editing) {
        this.marker.on('click', (event) => {
          const latLng = event.latlng; // Get latitude and longitude
          this.markerClicked.emit([latLng.lat, latLng.lng]);
        });
      }
      //this.markers.push(mp);
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
    if(this.markers.length == 0 && !this.marker){
      if (changes['touristPosition'] && changes['touristPosition'].currentValue) {
        this.addTouristMarker(changes['touristPosition'].currentValue);
      }
      }else{
        this.clearMarkers();
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
}
