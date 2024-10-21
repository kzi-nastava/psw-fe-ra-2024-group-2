import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { EventEmitter } from '@angular/core';



@Component({
  selector: 'xp-addtour',
  templateUrl: './addtour.component.html',
  styleUrls: ['./addtour.component.css']
})
export class AddtourComponent {

  @Output() tourAdded = new EventEmitter<null>();

  checkpoints: number[] = [];

  constructor(private service: TourAuthoringService) {}

  tourForm  = new FormGroup({
        name : new FormControl('', [Validators.required]),
        description : new FormControl('', [Validators.required]),
        status : new FormControl(0),
        tag : new FormControl(0),
        difficulty : new FormControl(0),
        price : new FormControl(0, [Validators.required])
  });

  onCheckpointAdded(checkpointId: number): void{
    this.checkpoints.push(checkpointId);
  }

  addTour(): void {
    const tour: Tour = {
      userId: 1,
      equipment: [],
      id: 0, // This will be updated after the tour is created
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      status: Number(this.tourForm.value.status) || 0,
      tag: Number(this.tourForm.value.tag) || 0,
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      price: Number(this.tourForm.value.price) || 0,
      checkpoints: [] // Checkpoints will be updated separately
    };
  
    // First, create the tour
    this.service.addTour(tour).subscribe({
      next: (createdTour) => {
        console.log('Tour created:', createdTour);
  
        // After the tour is created, update the checkpoints
        /*createdTour.checkpoints = this.checkpoints;
  
        // Call the service to update checkpoints with the newly created tour ID
        this.service.updateTourCheckpoints(createdTour).subscribe({
          next: (_) => {
            this.tourAdded.emit();
            console.log("Tour checkpoints updated successfully");
          },
          error: (err) => {
            console.error("Error updating checkpoints:", err);
          }
        });*/
      },
      error: (err) => {
        console.error("Error creating tour:", err);
      }
    });
  }
  

}
