import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../administration.service';
import { RatingWithUser } from '../model/rating-application.model';

@Component({
  selector: 'xp-rating-application',
  templateUrl: './rating-application.component.html',
  styleUrls: ['./rating-application.component.css']
})
export class RatingApplicationComponent implements OnInit {

  ratingWithUser: RatingWithUser[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getRatingApplication();
  }

  getRatingApplication(): void {
    this.service.getRatingApplication().subscribe({
      next: (result: PagedResults<RatingWithUser>) => {
        this.ratingWithUser = result.results;
      },
      error: () => {
      }
    })
  }
}
