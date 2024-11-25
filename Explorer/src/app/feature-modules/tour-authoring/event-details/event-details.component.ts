import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventModel } from '../model/event.model';
import { Tour } from '../model/tour.model';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'xp-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent {
  eventId: number;
  tours: Tour[] = []
  constructor(private route: ActivatedRoute,private service: TourAuthoringService) {}

  ngOnInit(): void {
    // Get the event id from the route parameters
    this.route.paramMap.subscribe(params => {
      this.eventId = +params.get('id')!;
    });
    this.service.getEventDetails(this.eventId).subscribe({
      next: (result: PagedResult<Tour>) =>{
        this.tours = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });

  }
}
