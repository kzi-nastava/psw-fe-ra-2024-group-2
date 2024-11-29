import { Component, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncounterService } from '../encounter.service';
import { HiddenLocationEncounterDto, MiscEncounterDto, SocialEncounterDto } from '../model/encounter.model';

interface Image {
  data: string;
  uploadedAt: string;
  mimeType: string;
}

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  encounterForm: FormGroup;
  selectedType: string = '';
  selectedLocation: { lat: number, lng: number } | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private encounterService: EncounterService) {
    this.encounterForm = this.createBaseForm();
  }

  ngOnInit(): void {
    this.encounterForm.get('type')?.valueChanges.subscribe((type: string) => {
      this.updateFormForType(type);
    });
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  // Add the onFileSelected method to handle image upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Create a URL for the selected image file
      const reader = new FileReader();
      reader.onload = () => {
        // Convert the file to an Image object
        const image: Image = {
          data: reader.result as string, // Base64 string
          uploadedAt: new Date().toISOString(), // Current timestamp
          mimeType: file.type // Mime type of the file
        };

        this.imagePreview = reader.result; // Set the image preview
        // Update the form control with the Image object
        this.encounterForm.patchValue({ image });
        this.encounterForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    console.log('Keypress detected:', event.key);
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 45) return false; // Prevent minus sign
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  updateFormForType(type: string) {
    this.selectedType = type;


    this.imagePreview = null;
    this.encounterForm.patchValue({ image: null }); // Clear the image in the form

    const baseForm = this.createBaseForm();
    // Removing the image control if it's present in the form for other types
    this.removeControls(['image']);

    switch (type) {
      case 'hidden':
        this.encounterForm = this.fb.group({
          ...baseForm.controls,
          image: ['', Validators.required],  // Ensure 'image' control is included
          rangeInMeters: ['', [Validators.required, Validators.min(0)]]
        });
        break;
      case 'social':
        this.encounterForm = this.fb.group({
          ...baseForm.controls,
          requiredPeople: ['', [Validators.required, Validators.min(1)]],
          rangeInMeters: ['', [Validators.required, Validators.min(0)]]
        });
        break;
      case 'misc':
        this.encounterForm = this.fb.group({
          ...baseForm.controls,
          actionDescription: ['', Validators.required]
        });
        break;
    }

    this.encounterForm.patchValue({ type });
  }

  removeControls(controlNames: string[]): void {
    controlNames.forEach(controlName => {
      if (this.encounterForm.contains(controlName)) {
        this.encounterForm.removeControl(controlName);
      }
    });
  }

  onLocationSelected(event: { lat: number, lng: number }): void {
    this.selectedLocation = event;
  }

  onSubmit(): void {
    if (this.encounterForm.valid && this.selectedLocation) {
      const formValue = this.encounterForm.value;
      let encounterDto: SocialEncounterDto | HiddenLocationEncounterDto | MiscEncounterDto | null = null;

      // Build the DTO based on the selected type
      switch (this.selectedType) {
        case 'social':
          encounterDto = {
            name: formValue.name,
            description: formValue.description,
            requiredPeople: formValue.requiredPeople,
            rangeInMeters: formValue.rangeInMeters,
            lattitude: this.selectedLocation.lat,
            longitude: this.selectedLocation.lng
          } as SocialEncounterDto;
          break;

        case 'hidden':
          encounterDto = {
            name: formValue.name,
            description: formValue.description,
            image: formValue.image as Image,
            targetLatitude: formValue.targetLatitude,
            targetLongitude: formValue.targetLongitude,
            rangeInMeters: formValue.rangeInMeters,
            lattitude: this.selectedLocation.lat,
            longitude: this.selectedLocation.lng
          } as HiddenLocationEncounterDto;
          break;

        case 'misc':
          encounterDto = {
            name: formValue.name,
            description: formValue.description,
            actionDescription: formValue.actionDescription,
            lattitude: this.selectedLocation.lat,
            longitude: this.selectedLocation.lng
          } as MiscEncounterDto;
          break;

        default:
          console.error('Invalid encounter type');
          return;
      }

      // Call the service to save the encounter
      this.encounterService.createEncounter(encounterDto).subscribe({
        next: (response) => {
          console.log('Encounter saved successfully:', response);
          // refresh the current page
          this.resetForm();
          window.location.reload();
          // Handle success (e.g., show a success message or redirect)
        },
        error: (error) => {
          console.error('Error saving encounter:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.error('Form is invalid or location not selected.');
    }
  }
  resetForm(): void {
    this.encounterForm.reset();
    this.selectedType = '';
    this.selectedLocation = null;
    this.imagePreview = null;
    this.encounterForm.patchValue({ type: '' }); // Reset the type field
  }
}
