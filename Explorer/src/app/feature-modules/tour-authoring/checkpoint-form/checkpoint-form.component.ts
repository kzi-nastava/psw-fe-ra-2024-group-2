import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { Image } from '../../../shared/model/image.model';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent {

  selectedImage: File | null = null; // To store the selected image file
  imagePreview: string | ArrayBuffer | null = null; // For previewing the image

  constructor(private service: TourAuthoringService){}

  checkpointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    image: new FormControl('') // New form control for the image
  });

  // Method to handle file input
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Preview the image
      };
      reader.readAsDataURL(file); // Convert the file to base64 format
    }
  }

  addCheckpoint(): void {
    // Ensure image is properly handled before submission
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string; // Get base64 string
        const image: Image = {
          data: base64String.split(',')[1], // Remove data URL prefix
          mimeType: this.selectedImage!.type,
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        const checkpoint: Checkpoint = {
          name: this.checkpointForm.value.name || "",
          description: this.checkpointForm.value.description || "",
          latitude: Number(this.checkpointForm.value.latitude || ""),
          longitude: Number(this.checkpointForm.value.longitude || ""),
          image: image // Attach image object to the checkpoint
        };

        console.log(checkpoint);

        this.service.addCheckpoint(checkpoint).subscribe({
          next: (_) => {
            console.log("Checkpoint added successfully");
          },
          error: (err) => {
            console.error("Error adding checkpoint:", err);
          }
        });
      };
      reader.readAsDataURL(this.selectedImage); // Convert image to base64
    } else {
      // Submit checkpoint without an image if no image is selected
      const checkpoint: Checkpoint = {
        name: this.checkpointForm.value.name || "",
        description: this.checkpointForm.value.description || "",
        latitude: Number(this.checkpointForm.value.latitude || ""),
        longitude: Number(this.checkpointForm.value.longitude || "")
      };

      console.log(checkpoint);

      this.service.addCheckpoint(checkpoint).subscribe({
        next: (_) => {
          console.log("Checkpoint added successfully without image");
        },
        error: (err) => {
          console.error("Error adding checkpoint:", err);
        }
      });
    }
  }
}
