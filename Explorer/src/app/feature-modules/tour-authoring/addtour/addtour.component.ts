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

  constructor(private service: TourAuthoringService) {}

  tourForm  = new FormGroup({
        name : new FormControl('', [Validators.required]),
        description : new FormControl('', [Validators.required]),
        status : new FormControl(0),
        tag : new FormControl(0),
        difficulty : new FormControl(0),
        price : new FormControl(0, [Validators.required])
  });

  addTour(): void {
    console.log(this.tourForm.value);

    const tour : Tour = {
      userId: 1,
      equipment: [],
      id: 0,
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      status: 0,
      tag: Number(this.tourForm.value.tag) || 0,
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      price: 0,
    }
    this.service.addTour(tour).subscribe({next: (_) => {this.tourAdded.emit();}});
  }

}
