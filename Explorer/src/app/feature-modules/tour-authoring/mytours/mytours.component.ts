import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';


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

    constructor(private service: TourAuthoringService, private router: Router) {}

    ngOnInit(): void {
      this.getTours();
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
