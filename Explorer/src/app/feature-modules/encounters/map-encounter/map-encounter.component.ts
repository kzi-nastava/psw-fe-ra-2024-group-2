import { Component, AfterViewInit, EventEmitter, Output, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { EncounterMapService } from './map-encounter.service';
import { EncounterService } from '../encounter.service'; // Import EncounterService
import * as L from 'leaflet';
import { Input } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

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
  @Output() proximityToHiddenEncounter = new EventEmitter<any>(); // Emit the entire encounter object
  showCompleteButton: boolean = false; // Flag to show/hide the button

  private routingControl: L.Routing.Control | null = null;
  private marker: L.Marker | null = null;
  private user : User | null;
  private positionCheckInterval: any; // For periodically checking the tourist position

  constructor(
    private mapService: EncounterMapService,
    private encounterService: EncounterService, // Inject EncounterService
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
          this.user = user;
        });
    // Start periodic position check when the component is initialized
    this.positionCheckInterval = setInterval(() => {
      if (this.touristPosition) {
        this.checkHiddenLocationMarkers(this.touristPosition);
        this.checkProximityToMiscEncounter(this.touristPosition);
        this.checkProximityToSocialEncounter(this.touristPosition);
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

      // Reverse search or other operations
      this.mapService.reverseSearch(lat, lng).subscribe((res) => { });

      this.locationSelected.emit({ lat, lng });

      // Remove the existing marker if present
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Add a new marker at the clicked location
      this.marker = L.marker([lat, lng]).addTo(this.map);

      // Handle tourist marker: Add it after the first click, or update its position
      if (!this.touristMarker) {
        // Create and add the tourist marker for the first time
        if (this.touristPosition) {
          this.touristMarker = L.marker([this.touristPosition.latitude, this.touristPosition.longitude])
            .addTo(this.map)
            .bindPopup('Current Tourist Position')
            .openPopup();
        }
      } else {
        // Update the tourist marker's position on subsequent clicks
        if (this.touristPosition) {
          this.touristMarker.setLatLng([this.touristPosition.latitude, this.touristPosition.longitude]);
        }
      }
    

      // Handle marker click events if in editing mode
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
    if (changes['touristPosition'] && changes['touristPosition'].currentValue) {
      this.checkHiddenLocationMarkers(changes['touristPosition'].currentValue);
      this.addTouristMarker(changes['touristPosition'].currentValue);
      // If the tourist marker exists, update its position
      if (this.touristMarker) {
        this.touristMarker.setLatLng([
          changes['touristPosition'].currentValue.latitude,
          changes['touristPosition'].currentValue.longitude,
        ]);
      }
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
      //onsole.log(encounter);


      if (encounter) {
        console.log(encounter);
        const rangeInMeters = encounter.hiddenLocationRangeInMeters || 200; // Default to 200 meters if range isn't set
        console.log(rangeInMeters);

        const distance = touristLatLng.distanceTo(marker.getLatLng());

        if (distance <= rangeInMeters) {
          if (!this.map.hasLayer(marker)) {
            marker.addTo(this.map);
            if (distance <= 30) {
              console.log("kYS NIGEGR")
              this.proximityToHiddenEncounter.emit(encounter);
            }
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
    console.log('Fetching encounters...');
    this.encounterService.getAllEncounters().subscribe({
      next: (encounters: any[]) => {
        console.log('Encounters received:', encounters);
        if (!encounters || encounters.length === 0) {
          console.log('No encounters found or empty array received');
          return;
        }
        
        encounters.forEach(encounter => {
          console.log('Processing encounter:', encounter);
          const lat = encounter.latitude;
          const lng = encounter.longitude;

          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            // Only process non-HiddenLocation encounters initially
            if (encounter.encounterType !== 'HiddenLocation') {
              console.log('Adding visible encounter marker:', encounter.encounterType);
              this.addEncounterMarker(encounter, lat, lng);
            } else {
              console.log('Adding hidden location marker');
              // Add the marker to hiddenLocationMarkers list
              this.addHiddenLocationMarker(encounter, lat, lng);
            }
          } else {
            console.log('Invalid coordinates for encounter:', { lat, lng, encounter });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching encounters:', error);
      }
    });
  }

  private addEncounterMarker(encounter: any, lat: number, lng: number): void {
    // Definišemo različite ikonice za različite tipove encounter-a
    const socialIcon = L.icon({
      iconUrl: 'assets/people.png', // Putanja do ikonice za Social
      iconSize: [32, 32], // Dimenzije ikonice
      iconAnchor: [16, 32], // Tačka gde se ikonica "kači" na mapu
      popupAnchor: [0, -32], // Pozicija popup-a u odnosu na ikonicu
    });
    const miscIcon = L.icon({
      iconUrl: 'assets/misc.png', // Putanja do ikonice za Misc
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const defaultIcon = L.icon({
      iconUrl: 'assets/misc.png', // Putanja do podrazumevane ikonice
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    // Postavljamo ikonicu na osnovu encounterType
    const markerIcon = encounter.encounterType === 'Social' ? socialIcon
      //: encounter.encounterType === 'Misc' ? miscIcon
      : miscIcon;

    const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(this.map)
      .bindPopup(`
      <div style="font-family: 'Georgia', sans-serif; color: #333; padding: 10px; border: 1px solid #D2B48C; border-radius: 8px; background-color: #F5F5DC;">
        <h3 style="margin: 0; font-size: 20px; color: #8B4513;">${encounter.name}</h3>
        <p style="margin: 5px 0; font-size: 18px; color: #5D3A1A;"><i>${encounter.description}</i></p>
        <p style="margin: 5px 0; font-size: 14px; color: #8B4513;">
          <small><strong>Coordinates:</strong> Lat: ${lat}, Lng: ${lng}</small>
        </p>
        ${encounter.actionDescription
          ? `<p style="margin: 5px 0; font-size: 14px; color: #5D3A1A;">
               <small><strong>Action:</strong> ${encounter.actionDescription}</small>
             </p>`
          : ''}
        ${encounter.image?.data
          ? `<div style="text-align: center; margin-top: 10px;">
               <img src="${encounter.image.data}" alt="Encounter Image" style="width: 100px; height: 100px; border-radius: 4px; border: 1px solid #D2B48C;" />
             </div>`
          : ''}
      </div>
    `);


    (marker.options as any).encounter = encounter; // Using `any` to bypass TypeScript's type checks

    this.persistentMarkers.push(marker); // Add all markers for non-hidden encounters
  }

  private addHiddenLocationMarker(encounter: any, lat: number, lng: number): void {
    const hiddenIcon = L.icon({
      iconUrl: 'assets/exclamation.png', // Putanja do ikonice za Misc
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    const marker = L.marker([lat, lng], { icon: hiddenIcon }).bindPopup(`
      <div style="font-family: 'Georgia', sans-serif; color: #333; padding: 10px; border: 1px solid #D2B48C; border-radius: 8px; background-color: #F5F5DC;">
        <h3 style="margin: 0; font-size: 20px; color: #8B4513;">${encounter.name}</h3>
        <p style="margin: 5px 0; font-size: 18px; color: #5D3A1A;"><i>${encounter.description}</i></p>
        <p style="margin: 5px 0; font-size: 14px; color: #8B4513;">
          <small><strong>Coordinates:</strong> Lat: ${lat}, Lng: ${lng}</small>
        </p>
        ${encounter.actionDescription
          ? `<p style="margin: 5px 0; font-size: 14px; color: #5D3A1A;">
               <small><strong>Action:</strong> ${encounter.actionDescription}</small>
             </p>`
          : ''}
        ${encounter.image?.data
          ? `<div style="text-align: center; margin-top: 10px;">
               <img src="${encounter.image.data}" alt="Encounter Image" style="width: 100px; height: 100px; border-radius: 4px; border: 1px solid #D2B48C;" />
             </div>`
          : ''}
      </div>
    `);

    // Store custom data on marker.options
    (marker.options as any).encounter = encounter; // Using `any` to bypass TypeScript's type checks

    this.hiddenLocationMarkers.push(marker); // Store the hidden location marker
  }

  // Add this @Output to emit proximity event
  @Output() proximityToMiscEncounter = new EventEmitter<any>(); // Emit the entire encounter object
  
  private checkProximityToMiscEncounter(touristPosition: { latitude: number, longitude: number }): void {
    const touristLatLng = L.latLng(touristPosition.latitude, touristPosition.longitude);
    
    this.persistentMarkers.forEach((marker) => {
      const encounter = (marker.options as any).encounter; // Access the stored encounter data
      
      if (encounter && encounter.encounterType === 'Misc') {
        const rangeInMeters = 20; // Set the range for proximity (20 meters)
        const distance = touristLatLng.distanceTo(marker.getLatLng()); // Calculate distance between tourist and marker
        
        if (distance <= rangeInMeters) {
          this.proximityToMiscEncounter.emit(encounter);
        } else {
          // Optionally, emit a null or false if out of range
          
          this.proximityToMiscEncounter.emit(null);  // Emit null or a suitable response when out of range
        }
      }
    });
  }


  @Output() proximityToSocialEncounter = new EventEmitter<any>();
  @Output() noProximityToSocialEncounter = new EventEmitter<any>();
  private checkProximityToSocialEncounter(touristPosition: { latitude: number, longitude: number }): void {
    const touristLatLng = L.latLng(touristPosition.latitude, touristPosition.longitude);
    
    var found = false;
    this.persistentMarkers.forEach((marker) => {
      const encounter = (marker.options as any).encounter; // Access the stored encounter data
      if (encounter && encounter.encounterType === 'Social') {
        const rangeInMeters = 50; // Set the range for proximity (20 meters)
        const distance = touristLatLng.distanceTo(marker.getLatLng()); // Calculate distance between tourist and marker
        
        if (distance <= rangeInMeters) {
          this.proximityToSocialEncounter.emit(encounter);
          found=true;
        } else {
          
          this.proximityToSocialEncounter.emit(null);  // Emit null or a suitable response when out of range
        }
      }
    });
    if (!found) {
      this.persistentMarkers.forEach((marker) => {
        const encounter = (marker.options as any).encounter; // Access the stored encounter data
        if (encounter && encounter.encounterType === 'Social') {
          // Remove the userId from the touristIds array
          encounter.touristIds = encounter.touristIds.filter((id: number) => id !== this.user?.id);
        }
      });
      this.noProximityToSocialEncounter.emit(1);
    }
    
  }
}