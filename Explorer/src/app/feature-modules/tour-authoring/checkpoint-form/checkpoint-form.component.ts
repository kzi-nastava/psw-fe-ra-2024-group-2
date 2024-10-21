import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { Image } from '../../../shared/model/image.model';
import { Tour } from '../model/tour.model';
import { MapComponent } from 'src/app/shared/map/map.component';
@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnInit{

  @Output() checkpointAdded = new EventEmitter<number>(); // Output event emitter

  selectedImage: File | null = null; // To store the selected image file
  imagePreview: string | ArrayBuffer | null = null; // For previewing the image
  tours: Tour[] = [];
  selectedTourId: number | null = null;;
  latitude: number = 0;
  longitude: number = 0;

  constructor(private service: TourAuthoringService){}

  checkpointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]), 
    image: new FormControl('') // New form control for the image
  });

  ngOnInit(): void {
    // Fetch the list of tours when the component initializes
    this.service.getTours().subscribe({
      next: (response) => {
        // If the response is a paged result or a wrapped object, adjust accordingly
        this.tours = response.results || []; // Adjust based on your actual structure
      },
      error: (err) => {
        console.error("Error fetching tours:", err);
      }
    });
  }
  

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

  onLocationSelected(location: { lat: number, lng: number }) {
    this.latitude = location.lat;
    this.longitude = location.lng;
  
    // Optionally, update the form controls directly
    this.checkpointForm.get('latitude')?.setValue(this.latitude.toString());
    this.checkpointForm.get('longitude')?.setValue(this.longitude.toString());
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
          latitude: Number(this.checkpointForm.value.latitude || 0), // Add latitude from form
          longitude: Number(this.checkpointForm.value.longitude || 0) ,
          image: image,
          //tours: this.selectedTourId ? [this.selectedTourId] : [] // Add selected tour ID here
        };

        // Modify this part inside the addCheckpoint() method to emit checkpoint ID
        this.service.addCheckpoint(checkpoint).subscribe({
          next: (response) => {
            const checkpointId = response.id as number; // Get the checkpoint ID
            console.log("Checkpoint added successfully. Id: " + response.id);
            this.checkpointAdded.emit(response.id as number); // Emit checkpoint ID after it's successfully added
            if (this.selectedTourId) {
              this.updateTourWithCheckpoint(this.selectedTourId, checkpointId);
            }
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
        longitude: Number(this.checkpointForm.value.longitude || ""),
        tours: this.selectedTourId ? [this.selectedTourId] : [] // Add selected tour ID here
      };

      this.service.addCheckpoint(checkpoint).subscribe({
        next: (response) => {
          const checkpointId = response.id as number; // Get the checkpoint ID
          console.log("Checkpoint added successfully without image");
          if (checkpoint.tours && checkpoint.tours.length > 0) {
            console.log(checkpoint.tours[0]);
          } else {
            console.log("No tours selected or available");
          }
          this.checkpointAdded.emit(response.id as number); // Emit the checkpoint to parent component
            // Now update the tour with the new checkpoint ID
          if (this.selectedTourId) {
            this.updateTourWithCheckpoint(this.selectedTourId, checkpointId);
          }
        },
        error: (err) => {
          console.error("Error adding checkpoint:", err);
        }
      });
    }
  }
  // Method to update the selected tour with the new checkpoint ID
  updateTourWithCheckpoint(tourId: number, checkpointId: number): void {
    this.service.getTourById(tourId).subscribe({
      next: (tour) => {
        // Check if checkpoints already exist and add the new checkpoint ID
        if (tour.checkpoints) {
          tour.checkpoints.push(checkpointId);
        } else {
          tour.checkpoints = [checkpointId];
        }

        // Now update the tour with the modified checkpoints list
        this.service.updateTourCheckpoints(tour).subscribe({
          next: () => {
            console.log(`Tour with ID ${tourId} successfully updated with checkpoint ID ${checkpointId}`);
          },
          error: (err) => {
            console.error(`Error updating tour with ID ${tourId}:`, err);
          }
        });
      },
      error: (err) => {
        console.error(`Error fetching tour with ID ${tourId}:`, err);
      }
    });
  }
   // Method to handle tour selection
   onTourSelect(event: any): void {
    this.selectedTourId = Number(event.target.value); // Convert to number if necessary
    console.log(this.selectedTourId);
  }
}
