import { Component } from '@angular/core';
import { EventModel } from '../model/event.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MatDialog } from '@angular/material/dialog';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'xp-event-analytics',
  templateUrl: './event-analytics.component.html',
  styleUrls: ['./event-analytics.component.css']
})
export class EventAnalyticsComponent {

  events: EventModel[] = []

  constructor(private service: TourAuthoringService, private dialog: MatDialog) {}


  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.service.getEventsSorted().subscribe({
      next: (result: PagedResult<EventModel>) =>{
        this.events = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });
  }
}
