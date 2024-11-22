import { Component, OnInit } from '@angular/core';
import { EventModel } from '../model/event.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MatDialog } from '@angular/material/dialog';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'xp-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit{
  events: EventModel[] = []

  constructor(private service: TourAuthoringService, private dialog: MatDialog) {}


  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.service.getEvents().subscribe({
      next: (result: PagedResult<EventModel>) =>{
        this.events = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });
  }

}
