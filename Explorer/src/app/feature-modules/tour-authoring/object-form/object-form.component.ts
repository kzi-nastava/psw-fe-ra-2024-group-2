import { Component,EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Object, ObjectCategory } from '../model/object.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent  {

  clearMarkersFlag: boolean = false;
  objectForm: FormGroup;
  selectedImage: File | null = null; 
  imagePreview: string | ArrayBuffer | null = null; 
  latitude: number = 0;
  longitude: number = 0;
  showErrorMessage = false;

  @Output() objectAdded = new EventEmitter<null>();

  constructor (private service: TourAuthoringService){
    this.objectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(""),
      latitude: new FormControl('', [Validators.required]), // For lat
      longitude: new FormControl('', [Validators.required]) // For lng

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
            this.objectForm.patchValue({
                image: { data: base64String.split(',')[1], mimeType, uploadedAt }
            });
            this.objectForm.get('image')!.updateValueAndValidity();
            this.imagePreview = base64String; // Set preview for the UI
        };
        reader.readAsDataURL(file); // Convert file to base64
    }
    event.target.value = ''; // This resets the file input field
}
onLocationSelected(location: { lat: number, lng: number }) {
  this.latitude = location.lat;
  this.longitude = location.lng;

  
  this.objectForm.get('latitude')?.setValue(this.latitude);
  this.objectForm.get('longitude')?.setValue(this.longitude);
}
addObject(): void {
  this.objectForm.markAllAsTouched();

  if (this.objectForm.valid) {
    const obj: Object = {
      name: this.objectForm.value.name || "",
      description: this.objectForm.value.description || "",
      image: this.objectForm.value.image, 
      category: this.objectForm.value.category as ObjectCategory,
      latitude: this.objectForm.value.latitude || 0,
      longitude: this.objectForm.value.longitude || 0 
    };

    this.service.addObject(obj).subscribe({
      next: (_) => {
        console.log(obj);
        this.objectAdded.emit();  
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
          console.error("Error adding object:", err);
        }
      }
    });
  } else {
    console.log("Form is invalid");
  }
}
  clearForm(): void {
    this.objectForm.reset(); 
    this.imagePreview = null; 
  }
  
}
