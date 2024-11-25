import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventCategory, EventModel } from '../model/event.model';

@Component({
  selector: 'xp-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  clearMarkersFlag: boolean = false;
  eventForm: FormGroup;
  selectedImage: File | null = null; 
  imagePreview: string | ArrayBuffer | null = null; 
  latitude: number = 0;
  longitude: number = 0;
  showErrorMessage = false;

  @Output() eventAdded = new EventEmitter<null>();

  constructor (private service: TourAuthoringService){
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(""),
      latitude: new FormControl('', [Validators.required]), // For lat
      longitude: new FormControl('', [Validators.required]), // For lng
      startDate: new FormControl(''),
      endDate: new FormControl('')

  });
}
clearMarkers(): void {
  this.clearMarkersFlag = true;
}

onMarkersCleared(): void {
  console.log('Markers cleared in the map component');
  setTimeout(() => {
    this.clearMarkersFlag = false; 
  });
}
onFileSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = () => {
          const base64String = reader.result as string;
          const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0]; 
          const uploadedAt = new Date().toISOString(); 
          // Update the form with the base64-encoded image
          this.eventForm.patchValue({
              image: { data: base64String.split(',')[1], mimeType, uploadedAt }
          });
          this.eventForm.get('image')!.updateValueAndValidity();
          this.imagePreview = base64String; // Set preview for the UI
      };
      reader.readAsDataURL(file); // Convert file to base64
  }
}
onLocationSelected(location: { lat: number, lng: number }) {
this.latitude = location.lat;
this.longitude = location.lng;


this.eventForm.get('latitude')?.setValue(this.latitude);
this.eventForm.get('longitude')?.setValue(this.longitude);
}
addEvent(): void {
this.eventForm.markAllAsTouched();

if (this.eventForm.valid) {
  const ev: EventModel = {
    id: 0,
    name: this.eventForm.value.name || "",
    description: this.eventForm.value.description || "",
    image: this.eventForm.value.image, 
    category: this.eventForm.value.category as EventCategory,
    latitude: this.eventForm.value.latitude || 0,
    longitude: this.eventForm.value.longitude || 0,
    startDate:this.eventForm.value.startDate,
    endDate: this.eventForm.value.endDate,
  };

  //console.log(obj)
  this.service.addEvent(ev).subscribe({
    next: (_) => {
      console.log(ev);
      this.eventAdded.emit();  
      this.clearForm();  
    },
    error: (err) => {
      if (err.status === 409) { // Check if the error code is 409
        console.error("Image already exists!");
        this.showErrorMessage = true; 
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      
      } else {
        console.error("Error adding event:", err.error);
      }
    }
  });
} else {
  console.log("Form is invalid");
}
}
clearForm(): void {
  this.eventForm.reset(); 
  this.imagePreview = null; 
}

}