import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';

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
          console.log(result)
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
}
