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

  deleteButtonDialog: boolean = false;
  updateButtonDialog: boolean = false;
  selectedEvent : EventModel;



  constructor(private service: TourAuthoringService, private dialog: MatDialog) {}


  ngOnInit(): void {
    this.getEvents();
  }

  refreshEvents(): void {
    this.updateButtonDialog = !this.updateButtonDialog;
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

  deleteOverlay(event:EventModel): void{
    this.deleteButtonDialog = !this.deleteButtonDialog;
    this.selectedEvent = event;
  }
  updateOverlay(event:EventModel): void{ 
    this.updateButtonDialog = !this.updateButtonDialog;
    this.selectedEvent = event;
  }

  confirmDelete(): void{
   console.log('deleting event', this.selectedEvent.id)
     this.service.deleteEvent(this.selectedEvent.id).subscribe({
        next: (result: any) =>{
          console.log(result)
          this.getEvents();
          this.deleteButtonDialog = !this.deleteButtonDialog;
        },
        error: (err:any) => {
          console.log(err)
        }
      });  
  }
  cancelDelete(): void{
    this.deleteButtonDialog = !this.deleteButtonDialog;
  } 

  onCancelUpdate(): void{
    this.updateButtonDialog = !this.updateButtonDialog;
  }
}
