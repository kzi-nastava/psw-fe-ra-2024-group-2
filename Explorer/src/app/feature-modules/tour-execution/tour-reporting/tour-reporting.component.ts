import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-tour-reporting',
  templateUrl: './tour-reporting.component.html',
  styleUrls: ['./tour-reporting.component.css']
})
export class TourReportingComponent implements OnInit {

  tour: Tour[] =[]
  selectedTour: Tour
  shouldRenderReportForm: boolean = false;
  selectedTourId!: number;
  selectedUserId!: number;
  user: any;

  constructor(private service: TourExecutionService, private authService: AuthService){}

  ngOnInit():void{
    this.service.getTours().subscribe({
      next:(result: PagedResult<Tour>)=>{
        this.tour = result.results;
      },
      error: (err: any) => console.error('Failed to load tours', err)
    }),
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onAddClicked(tour: Tour): void {
    this.shouldRenderReportForm = true;
    this.selectedTour = tour
    this.selectedTourId = tour.id
    this.selectedUserId = this.user.id
  }

}
