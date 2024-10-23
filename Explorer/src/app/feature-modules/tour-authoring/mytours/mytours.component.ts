import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Checkpoint } from '../model/checkpoint.model';
import { MatDialog } from '@angular/material/dialog';
import { ObjectUpdateComponent } from '../object-update/object-update.component';

export enum Status
{
   Draft = 0,
   Published = 1,
   Archived = 2
}

export enum Tag 
{
   Adventure = 0,
   Relaxation = 1,
   Historical = 2,
   Cultural = 3,
   Nature = 4
}

export enum Difficulty  
{
   Easy = 0,
   Moderate = 1,
   Hard = 2
}

@Component({
  selector: 'xp-mytours',
  templateUrl: './mytours.component.html',
  styleUrls: ['./mytours.component.css']
})


export class MyToursComponent implements OnInit{

  tours: Tour[] = []
  tourObjects: any[] = []; 
  tourCheckpoints: any[] = [];
  tourCheckpointObjects: any[] = [];
  //selectedObject: Object | null = null;

    constructor(private service: TourAuthoringService, private router: Router, private dialog: MatDialog) {}

    ngOnInit(): void {
      this.getTours();
      this.loadTourObjects();
      this.loadTourCheckpoints();
    }

    loadTourObjects() {
      this.service.getObjects().subscribe({
       
        next: (result: PagedResult<Object>) =>{
          this.tourObjects = result.results
        },
        error: (error) => {
          console.error('Error fetching objects from the backend:', error);
        }
    });
    }
    
    loadTourCheckpoints(): void{
      this.service.getCheckpoints().subscribe({
        next: (result: PagedResult<Checkpoint>) =>{
          this.tourCheckpoints = result.results;
          this.linkToursWithCheckpoints();

        },
        error: (error) => {
          console.error('Error fetching checkpoints from the backend: ', error);
        }
      })
    }


    //this will work for now, but in the future we should update checkpoint model since its -> (1,1)
    linkToursWithCheckpoints(): void {
      this.tourCheckpointObjects = this.tours.map(tour => {
        const checkpointsForTour = this.tourCheckpoints.filter(
          (checkpoint) => tour.checkpoints.includes(checkpoint.id)
        );
        return {
          tourId: tour.id,
          checkpoints: checkpointsForTour
        };
      });
    }

    getTours(): void {
      this.service.getTours().subscribe({
        next: (result: PagedResult<Tour>) =>{
          this.tours = result.results
        },
        error: (err:any) => {
          console.log(err)
        }
      });
    }  

    showTourClick(tour: Tour): void {
      this.router.navigate(['/edittours'], { queryParams: { tour: JSON.stringify(tour) } });
    }

    getStatusLabel(status: number): string {
      return Status[status];
    }
  
    getTagLabel(tag: number): string {
      return Tag[tag];
    }
  
    getDifficultyLabel(difficulty: number): string {
      return Difficulty[difficulty];
    }
}
