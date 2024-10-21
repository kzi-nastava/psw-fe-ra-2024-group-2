import { Component, Output, EventEmitter } from '@angular/core';
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

  @Output() checkpointAdded = new EventEmitter<number>(); // Output event emitter

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
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string; 
        const image: Image = {
          data: base64String.split(',')[1], 
          mimeType: this.selectedImage!.type,
          uploadedAt: new Date().toISOString() 
        };

        const checkpoint: Checkpoint = {
          name: this.checkpointForm.value.name || "",
          description: this.checkpointForm.value.description || "",
          latitude: Number(this.checkpointForm.value.latitude || ""),
          longitude: Number(this.checkpointForm.value.longitude || ""),
          image: image 
        };

        // Modify this part inside the addCheckpoint() method to emit checkpoint ID
        this.service.addCheckpoint(checkpoint).subscribe({
          next: (response) => {
            console.log("Checkpoint added successfully. Id: " + response.id);
            this.checkpointAdded.emit(response.id as number); // Emit checkpoint ID after it's successfully added
          },
          error: (err) => {
            console.error("Error adding checkpoint:", err);
          }
        });

      };
      reader.readAsDataURL(this.selectedImage); 
    } else {
      const checkpoint: Checkpoint = {
        name: this.checkpointForm.value.name || "",
        description: this.checkpointForm.value.description || "",
        latitude: Number(this.checkpointForm.value.latitude || ""),
        longitude: Number(this.checkpointForm.value.longitude || "")
      };

      this.service.addCheckpoint(checkpoint).subscribe({
        next: (response) => {
          console.log("Checkpoint added successfully without image");
          this.checkpointAdded.emit(response.id as number); // Emit the checkpoint to parent component
        },
        error: (err) => {
          console.error("Error adding checkpoint:", err);
        }
      });
    }
  }
}
