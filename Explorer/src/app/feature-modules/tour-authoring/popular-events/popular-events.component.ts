import { Component } from '@angular/core';
import { EventModel } from '../model/event.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MatDialog } from '@angular/material/dialog';
import { PagedResult } from '../shared/model/tour.module';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-popular-events',
  templateUrl: './popular-events.component.html',
  styleUrls: ['./popular-events.component.css']
})
export class PopularEventsComponent {
  events: EventModel[] = []

  constructor(private service: TourAuthoringService, private dialog: MatDialog, private router: Router) {}


  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.service.getPopularEvents().subscribe({
      next: (result: PagedResult<EventModel>) =>{
        this.events = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });
  }
  goToEventDetails(eventId: number): void {
    this.router.navigate([`/event`, eventId]);
  }
}
