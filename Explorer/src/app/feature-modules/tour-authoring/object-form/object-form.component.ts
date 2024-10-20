import { Component,EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Object, ObjectCategory } from '../model/object.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent  {

  objectForm: FormGroup;
  selectedImage: File | null = null; 
  imagePreview: string | ArrayBuffer | null = null; 

  @Output() objectAdded = new EventEmitter<null>();
  constructor (private service: TourAuthoringService){
    this.objectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(""),
  });

  }

  onFileSelect(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type
            const uploadedAt = new Date().toISOString(); // Current timestamp
            // Update the form with the base64-encoded image
            this.objectForm.patchValue({
                image: { data: base64String.split(',')[1], mimeType, uploadedAt }
            });
            this.objectForm.get('image')!.updateValueAndValidity();
            this.imagePreview = base64String; // Set preview for the UI
        };
        reader.readAsDataURL(file); // Convert file to base64
    }
}
  
  addObject(): void{

    console.log(this.objectForm.value)
    const obj: Object = {
      name: this.objectForm.value.name || "",
      description: this.objectForm.value.description || "",
      image: this.objectForm.value.image, 
      category: this.objectForm.value.category as ObjectCategory || ObjectCategory.WC

    }

    this.service.addObject(obj).subscribe({
      next:(_) => {
        this.objectAdded.emit()
       
      }
    });
  }
}
