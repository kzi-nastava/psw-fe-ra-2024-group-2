import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import * as L from 'leaflet';
import { KeyPoint } from '../tour/model/keyPoint.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})

export class MapSelectorComponent implements OnInit {

  private map!: L.Map;
  private marker!: L.Marker;
  private currentMarkers: L.Marker[] = [];
  private currentLocations: KeyPoint[] = []; // Store current locations
  private isEditing = false;
  private guideUser = false;
  

  @Input() locations: KeyPoint[] | null = null;
  @Output() newKeyPoints = new EventEmitter<KeyPoint[]>();  ngOnInit(): void {
    this.initMap();
    this.loadInputLocations();
  }

  constructor(
      private authService: AuthService
    ) {
      const user: User = this.authService.user$.getValue();
      if(user.role == 'author'){
        this.guideUser = true;
      }
    }

  private initMap(): void {
    this.map = L.map('map').setView([45.2671, 19.8335], 13); // Postavi centar (Novi Sad)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      if(this.guideUser){
        const { lat, lng } = e.latlng;
        this.addMarker(lat, lng);        
      }      
      //this.locationSelected.emit({ lat, lng });
    });
  }

  private loadInputLocations(): void {
    if (this.locations) {
      this.locations.forEach(location => {
        this.addPermanentMarker(location.latitude, location.longitude, location.name, location.description);
      });
      this.currentLocations = [...this.locations]; // Copy initial locations
    }
  }

  private addMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.showForm(lat, lng);
  }

  private showForm(lat: number, lng: number): void {
    const formHtml = `
      <form id="markerForm">
        <label>Name:</label>
        <input type="text" id="markerName" required /><br />
        <label>Description:</label>
        <input type="text" id="markerDescription" required /><br />
        <button type="submit" id="saveBtn">Save</button>
      </form>
    `;
  
    //const tempMarker = L.marker([lat, lng]).addTo(this.map);
    this.marker.bindPopup(formHtml).openPopup();
  
    //this.marker.bindPopup(formHtml).openPopup();
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  
    setTimeout(() => {
      const form = document.getElementById('markerForm') as HTMLFormElement;
      form?.addEventListener('submit', (event) => {
        event.preventDefault();
  
        const name = (document.getElementById('markerName') as HTMLInputElement).value.trim();
        const description = (document.getElementById('markerDescription') as HTMLInputElement).value.trim();
  
        if (!name || !description) {
          alert("Please enter both Name and Description.");
          return;
        }
  
        // ✅ Show alert with entered details
        alert(`Saved:\nName: ${name}\nDescription: ${description}\nLat: ${lat}\nLng: ${lng}`);

        //this.map.removeLayer(this.marker);
        this.addPermanentMarker(lat, lng, name, description);
  
        // ✅ Emit location with details
        //this.locationSelected.emit({ lat, lng, name, description });
  
        // ✅ Close popup after submission
        //this.marker.closePopup();
      });
    }, 100);
    //this.map.removeLayer(tempMarker);

  }


  private addPermanentMarker(latitude: number, longitude: number, name: string, description: string): void {
    const marker = L.marker([latitude, longitude], { icon: this.getRedIcon() }).addTo(this.map);
    const roundedLat = latitude.toFixed(2);
    const roundedLng = longitude.toFixed(2);
    this.currentMarkers.push(marker);
  
    const newLocation = { latitude, longitude, name, description };
    this.currentLocations.push(newLocation);
    
    
    var popupContent = "";
    // Create a dynamic popup content with buttons for update and delete
    if(this.guideUser){
      popupContent = `
      <strong>Name: </strong><span class="popup-name">${name}</span><br>
      <strong>Description: </strong><span class="popup-description">${description}</span><br>
      Lat: ${roundedLat}<br>
      Lng: ${roundedLng}<br>
      <button class="update-btn">Update</button><br>
      <button class="delete-btn">Delete</button>
    `;
    } else{
      popupContent = `
      <strong>Name: </strong><span class="popup-name">${name}</span><br>
      <strong>Description: </strong><span class="popup-description">${description}</span><br>
      Lat: ${roundedLat}<br>
      Lng: ${roundedLng}<br>
    `;
    }
    


  
    marker.bindPopup(popupContent).openPopup();
  
    // Attach the event listeners to the buttons inside the popup
    marker.on('popupopen', () => {
      const updateButton = document.querySelector('.update-btn') as HTMLElement;
      const deleteButton = document.querySelector('.delete-btn') as HTMLElement;
  
      // Bind the update button click event to the updateMarker method
      updateButton.onclick = () => {
        if (!this.isEditing) {
          // First click: Allow the user to edit name and description
          const nameElement = document.querySelector('.popup-name') as HTMLElement;
          const descriptionElement = document.querySelector('.popup-description') as HTMLElement;
  
          // Convert the name and description to editable inputs
          nameElement.innerHTML = `<input type="text" value="${name}" class="edit-name">`;
          descriptionElement.innerHTML = `<input type="text" value="${description}" class="edit-description">`;
  
          // Change the button to "Save" for the next click
          updateButton.innerHTML = 'Save';
          this.isEditing = true;
          console.log("editing");
        } else {
          console.log("not editing");
          // Second click: Save the changes
          const newName = (document.querySelector('.edit-name') as HTMLInputElement).value;
          const newDescription = (document.querySelector('.edit-description') as HTMLInputElement).value;
  
          // Update the marker with new name and description
          this.updateMarker(marker, latitude, longitude, newName, newDescription);
  
          // Reset the update button text to "Update"
          updateButton.innerHTML = 'Update';
          this.isEditing = false;
        }
      };
  
      // Bind the delete button click event to the deleteMarker method
      deleteButton.onclick = () => {
        this.deleteMarker(marker, latitude, longitude);
      };
    });
  }
  

  private getRedIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red marker icon
      iconSize: [32, 32], // Adjust size as needed
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }
  

  ngOnDestroy(): void {
    // Emit updated locations when the component is destroyed
    this.newKeyPoints.emit(this.currentLocations);
  }

  private deleteMarker(marker: L.Marker, lat: number, lng: number): void {
    // Remove marker from map
    this.map.removeLayer(marker);
    
    // Remove marker from the currentMarkers array
    const markerIndex = this.currentMarkers.indexOf(marker);
    if (markerIndex !== -1) {
      this.currentMarkers.splice(markerIndex, 1);
    }
  
    // Remove location from currentLocations array
    const locationIndex = this.currentLocations.findIndex(loc => loc.latitude === lat && loc.longitude === lng);
    if (locationIndex !== -1) {
      this.currentLocations.splice(locationIndex, 1);
    }
  }
  
  private updateMarker(marker: L.Marker, latitude: number, longitude: number, name: string, description: string): void {
    // Update marker position
    marker.setLatLng([latitude, longitude]);
    // Update marker popup content
    const roundedLat = latitude.toFixed(2);
    const roundedLng = longitude.toFixed(2);

    const popupContent = `
      <strong>Name: </strong><span class="popup-name">${name}</span><br>
      <strong>Description: </strong><span class="popup-description">${description}</span><br>
      Lat: ${roundedLat}<br>
      Lng: ${roundedLng}<br>
      <button class="update-btn">Update</button><br>
      <button class="delete-btn">Delete</button>
    `;
  
    
    marker.setPopupContent(popupContent).openPopup();
  
    // Update location in currentLocations array
    const locationIndex = this.currentLocations.findIndex(loc => loc.latitude === marker.getLatLng().lat && loc.longitude === marker.getLatLng().lng);
    if (locationIndex !== -1) {
      this.currentLocations[locationIndex] = { latitude, longitude, name, description };
    }
  }
  

}
