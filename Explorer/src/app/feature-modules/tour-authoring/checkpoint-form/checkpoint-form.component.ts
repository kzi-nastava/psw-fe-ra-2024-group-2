import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent {

  constructor(private service: TourAuthoringService){}


  checkpointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude : new FormControl('', [Validators.required]),

  })

  addCheckpoint(): void{
    console.log(this.checkpointForm.value);

    const checkpoint: Checkpoint = {
      name: this.checkpointForm.value.name || "", //ako ne postoji name, prosledi prazan string
      description: this.checkpointForm.value.description || "",
      latitude: Number(this.checkpointForm.value.latitude || ""),
      longitude: Number(this.checkpointForm.value.longitude || "")
    }
    console.log(checkpoint);

    this.service.addCheckpoint(checkpoint).subscribe({
      next: (_) => {
        console.log("Uspesan zahtev")
      }
    });
  }
}
