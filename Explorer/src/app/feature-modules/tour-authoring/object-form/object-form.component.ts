import { Component,EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Object, ObjectCategory } from '../model/object.model';
import { AdministrationService } from '../../administration/administration.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent  {

  objectForm: FormGroup;
  selectedImage: File | null = null; // To store the selected image file
  imagePreview: string | ArrayBuffer | null = null; // Variable to hold the base64 preview

  @Output() objectAdded = new EventEmitter<null>();
  constructor (private service: TourAuthoringService){
    this.objectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(""),
  });

       /* let imageData = data.image?.data;

        if (imageData) {
            this.imagePreview = imageData;
        }*/
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type from base64 string
            const uploadedAt = new Date().toISOString(); // Get the current date and time
            this.objectForm.patchValue({ image: { data: base64String, mimeType, uploadedAt } }); // Update the form control with base64 string
            this.objectForm.get('image')!.updateValueAndValidity();

            this.imagePreview = base64String; // Set the preview to the base64 string
        };
        reader.readAsDataURL(file); // Convert file to DataURL (base64 encoded string)
    }
}
  
  addObject(): void{

    console.log(this.objectForm.value)
    const obj: Object = {
      name: this.objectForm.value.name || "",
      description: this.objectForm.value.description || "",
      image: this.objectForm.value.image, // Set this to the appropriate image data if needed
      category: this.objectForm.value.category as ObjectCategory || ObjectCategory.WC

    }

    this.service.addObject(obj).subscribe({
      next:(_) => {
        this.objectAdded.emit()
        //this.service.getObjects()
      }
    });
  }
}
