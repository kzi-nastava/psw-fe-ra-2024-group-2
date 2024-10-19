import { Component, OnInit } from '@angular/core';
import { Checkpoint } from '../model/checkpoint.model';
import { HttpClient } from '@angular/common/http';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit{
  
  checkpoints: Checkpoint[];

  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.service.getCheckpoints().subscribe({
      next: (result: PagedResult<Checkpoint>) =>{
        this.checkpoints = result.results
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

}
