import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { EncounterMapService } from './map-encounter.service';
import { EncounterService } from '../encounter.service'; // Import EncounterService
import * as L from 'leaflet';
import { Input } from '@angular/core';

@Component({
  selector: 'xp-map-encounter',
  templateUrl: './map-encounter.component.html',
  styleUrls: ['./map-encounter.component.css']
})
export class MapEncounterComponent implements AfterViewInit, OnDestroy, OnInit {
  map: any;
  private markers: L.Marker[] = [];
  private persistentMarkers: L.Marker[] = []; // Markers for non-hidden encounters
  private hiddenLocationMarkers: L.Marker[] = []; // Markers for hidden locations

  @Output() markerClicked = new EventEmitter<[number, number]>();
  @Output() markersCleared: EventEmitter<void> = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Input() clearMarkersTrigger: boolean = false;
  @Input() touristPosition: { latitude: number, longitude: number } | null = null;
  @Input() isClickDisabled: boolean = false;
  @Input() editing: boolean = false;

  private routingControl: L.Routing.Control | null = null;
  private marker: L.Marker | null = null;

  private positionCheckInterval: any; // For periodically checking the tourist position

  constructor(
    private mapService: EncounterMapService,
    private encounterService: EncounterService // Inject EncounterService
  ) {}

  ngOnInit(): void {
    // Start periodic position check when the component is initialized
    this.positionCheckInterval = setInterval(() => {
      if (this.touristPosition) {
        this.checkHiddenLocationMarkers(this.touristPosition);
      }
    }, 5000); // Check every 5 seconds (adjust as needed)
  }

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
        this.checkHiddenLocationMarkers(changes['touristPosition'].currentValue);
      }
    } else {
      this.clearMarkers();
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

  private checkHiddenLocationMarkers(position: { latitude: number, longitude: number }): void {
    const touristLatLng = L.latLng(position.latitude, position.longitude);
  
    this.hiddenLocationMarkers.forEach((marker) => {
      const encounter = (marker.options as any).encounter; // Access the stored encounter data
      console.log(encounter);
      
  
      if (encounter) {
        const rangeInMeters = encounter.hiddenLocationRangeInMeters || 200; // Default to 200 meters if range isn't set
        console.log(rangeInMeters);
  
        const distance = touristLatLng.distanceTo(marker.getLatLng());
  
        if (distance <= rangeInMeters) {
          if (!this.map.hasLayer(marker)) {
            marker.addTo(this.map); // Add marker if within range
          }
        } else {
          if (this.map.hasLayer(marker)) {
            this.map.removeLayer(marker); // Remove marker if out of range
          }
        }
      }
    });
  }
  

  ngOnDestroy(): void {
    if (this.positionCheckInterval) {
      clearInterval(this.positionCheckInterval); // Stop the position check interval
    }

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
          // Only process non-HiddenLocation encounters initially
          if (encounter.encounterType !== 'HiddenLocation') {
            this.addEncounterMarker(encounter, lat, lng);
          } else {
            // Add the marker to hiddenLocationMarkers list
            this.addHiddenLocationMarker(encounter, lat, lng);
          }
        }
      });
    });
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
    
    this.persistentMarkers.push(marker); // Add all markers for non-hidden encounters
  }

  private addHiddenLocationMarker(encounter: any, lat: number, lng: number): void {
    const marker = L.marker([lat, lng]).bindPopup(`
      <b>${encounter.name}</b><br>
      <i>${encounter.description}</i><br>
      <small>Lat: ${lat}, Lng: ${lng}</small><br>
      ${encounter.image?.data ? `<img src="${encounter.image?.data}" alt="Encounter Image" style="width: 100px; height: 100px;"/>` : ''}
    `);

      // Store custom data on marker.options
    (marker.options as any).encounter = encounter; // Using `any` to bypass TypeScript's type checks
    
    this.hiddenLocationMarkers.push(marker); // Store the hidden location marker
  }



}
