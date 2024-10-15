import { Component , OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { RatingApplication } from '../model/rating-application.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-rating-application',
  templateUrl: './rating-application.component.html',
  styleUrls: ['./rating-application.component.css']
})
export class RatingApplicationComponent implements OnInit {

  ratingApplication: RatingApplication[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getRatingApplication();
  }

  getRatingApplication(): void {
    this.service.getRatingApplication().subscribe({
      next: (result: PagedResults<RatingApplication>) => {
        this.ratingApplication = result.results;
      },
      error: () => {
      }
    })
  }
}
