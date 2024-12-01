import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { EncounterMapService } from './map-encounter.service';
import { EncounterService } from '../encounter.service'; // Import EncounterService
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
  private hiddenMarkers: Set<string> = new Set(); // Track hidden markers already added
  private persistentMarkers: L.Marker[] = []; // Markers for non-hidden encounters

  @Output() markerClicked = new EventEmitter<[number, number]>();
  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Input() clearMarkersTrigger: boolean = false;
  @Input() touristPosition: { latitude: number, longitude: number } | null = null;
  @Input() isClickDisabled: boolean = false;
  @Input() editing: boolean = false;

  private routingControl: L.Routing.Control | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private mapService: EncounterMapService,
    private encounterService: EncounterService // Inject EncounterService
  ) {}

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    setTimeout(() => {
      this.initMap();
    }, 0); // Delay to ensure the DOM is fully ready

    // Fetch encounters when the map is initialized
    this.fetchEncounters();
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
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {});

      this.locationSelected.emit({ lat, lng });
      // Remove the existing marker if present
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Add the new marker
      this.marker = new L.Marker([lat, lng]).addTo(this.map);
      if (this.editing) {
        this.marker.on('click', (event) => {
          const latLng = event.latlng; // Get latitude and longitude
          this.markerClicked.emit([latLng.lat, latLng.lng]);
        });
      }
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
    if (this.markers.length === 0 && !this.marker) {
      if (changes['touristPosition'] && changes['touristPosition'].currentValue) {
        this.addTouristMarker(changes['touristPosition'].currentValue);
      }
    } else {
      this.clearMarkers();
    }

    // Check for updates to hidden encounters
    if (changes['touristPosition']) {
      this.updateHiddenEncounters();
    }
  }

  private touristMarker: L.Marker | null = null;

  private addTouristMarker(position: { latitude: number, longitude: number }): void {
    if (this.touristMarker) {
      this.touristMarker.setLatLng([position.latitude, position.longitude]);
    } else {
      this.touristMarker = L.marker([position.latitude, position.longitude]).addTo(this.map)
        .bindPopup('Current Tourist Position')
        .openPopup();
      this.markers.push(this.touristMarker);
    }
  }

  private updateHiddenEncounters(): void {
    if (!this.touristPosition?.latitude || !this.touristPosition?.longitude) {
      return; // Exit if tourist position is not available
    }
  
    this.encounterService.getAllEncounters().subscribe((encounters: any[]) => {
      encounters.forEach(encounter => {
        if (encounter.type === 'HiddenLocation') {
          const lat = encounter.latitude;
          const lng = encounter.longitude;
  
          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            const distance = this.calculateDistance(
              this.touristPosition!.latitude,
              this.touristPosition!.longitude,
              lat,
              lng
            );
  
            if (distance <= encounter.range && !this.isMarkerAlreadyAdded(lat, lng)) {
              this.addEncounterMarker(encounter, lat, lng); // Add marker only if it hasn't been added yet
            }
          }
        }
      });
    });
  }
  

  private isMarkerAlreadyAdded(lat: number, lng: number): boolean {
    const key = `${lat}-${lng}`;
    if (this.hiddenMarkers.has(key)) {
      return true;
    }
    this.hiddenMarkers.add(key);
    return false;
  }

  private addEncounterMarker(encounter: any, lat: number, lng: number): void {
    const marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`
        <b>${encounter.name}</b><br>
        <i>${encounter.description}</i><br>
        <small>Lat: ${lat}, Lng: ${lng}</small><br>
        ${encounter.actionDescription ? `<small>Action: ${encounter.actionDescription}</small><br>` : ''}
        ${encounter.image?.data ? `<img src="${encounter.image?.data}" alt="Encounter Image" style="width: 100px; height: 100px;"/>` : ''}
      `);
        console.log(encounter); 
    if (encounter.type === 'HiddenLocation') {
      this.markers.push(marker); // Add dynamic markers for hidden locations
    } else {
      this.persistentMarkers.push(marker); // Keep persistent markers for other types
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private fetchEncounters(): void {
    this.encounterService.getAllEncounters().subscribe((encounters: any[]) => {
      encounters.forEach(encounter => {
        const lat = encounter.latitude;
        const lng = encounter.longitude;
  
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          if (encounter.type === 'HiddenLocation') {
            // Don't add hidden location markers immediately
            // They will be added dynamically based on tourist position later
            this.hiddenMarkers.add(`${lat}-${lng}`);
          } else {
            // Add persistent markers for non-hidden locations
            this.addEncounterMarker(encounter, lat, lng);
          }
        }
      });
    });
  }
  


}
