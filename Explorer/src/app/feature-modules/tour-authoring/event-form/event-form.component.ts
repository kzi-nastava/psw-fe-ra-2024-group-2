import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventCategory, EventModel } from '../model/event.model';
import {Router} from '@angular/router';
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

  steps = ['Basic Info', 'Image Upload', 'Date', 'Location', 'Review'];
  currentStep = 0;

  @Output() eventAdded = new EventEmitter<null>();

  constructor(private service: TourAuthoringService, private router: Router) {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    } else {
      this.markControlsTouchedForCurrentStep();
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  private getControlsForStep(step: number): string[] {
    switch (step) {
      case 0: return ['name', 'description', 'category'];
      case 1: return ['image'];
      case 2: return ['startDate', 'endDate'];
      case 3: return ['latitude', 'longitude'];
      default: return [];
    }
  }

  private isCurrentStepValid(): boolean {
    const controls = this.getControlsForStep(this.currentStep);
    return controls.every(ctrl => this.eventForm.get(ctrl)?.valid);
  }

  private markControlsTouchedForCurrentStep(): void {
    const controls = this.getControlsForStep(this.currentStep);
    controls.forEach(ctrl => this.eventForm.get(ctrl)?.markAsTouched());
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
        this.eventForm.patchValue({
          image: { data: base64String.split(',')[1], mimeType, uploadedAt }
        });
        this.eventForm.get('image')!.updateValueAndValidity();
        this.imagePreview = base64String;
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.latitude = location.lat;
    this.longitude = location.lng;

    this.eventForm.get('latitude')?.setValue(this.latitude);
    this.eventForm.get('longitude')?.setValue(this.longitude);
  }

  addEvent(): void {
    if (this.currentStep < this.steps.length - 1) {
      return;
    }

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
        startDate: this.eventForm.value.startDate,
        endDate: this.eventForm.value.endDate,
        eventAcceptances: []
      };

      this.service.addEvent(ev).subscribe({
        next: (_) => {
          console.log(ev);
          this.eventAdded.emit();
          this.clearForm();
          this.router.navigate(['/events']);

        },
        error: (err) => {
          if (err.status === 409) {
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
    this.currentStep = 0;
  }
}
