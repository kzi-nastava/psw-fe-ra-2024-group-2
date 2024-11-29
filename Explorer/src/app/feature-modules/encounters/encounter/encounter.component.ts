import { Component, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
        this.imagePreview = reader.result; // Set the image preview
      };
      reader.readAsDataURL(file);

      // Update the form control with the file
      this.encounterForm.patchValue({ image: file });
      this.encounterForm.get('image')?.updateValueAndValidity();
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
      const encounter = {
        ...formValue,
        latitude: this.selectedLocation.lat,
        longitude: this.selectedLocation.lng
      };
      console.log('Encounter to save:', encounter);
      // Add API call here
    } else {
      console.error('Form is invalid or location not selected.');
    }
  }
}
