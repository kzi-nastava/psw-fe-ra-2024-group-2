import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventModel } from '../model/event.model';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'app-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.css']
})
export class EventsCalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Current month
  events: EventModel[] = []; // List of events
  selectedEvent: EventModel | null = null; // Track the selected event
  constructor(private service: TourAuthoringService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // Fetch events using the service
   loadEvents(): void {
    this.service.getAllEvents().subscribe({
      next: (result: PagedResult<EventModel>) => {
        this.events = result.results.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }));
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
      },
    });
    
    }

    getEventsForDay(date: Date): EventModel[] {
      return this.events.filter(event => {
        const startDate = this.stripTime(event.startDate);
        const endDate = this.stripTime(event.endDate);
        const currentDate = this.stripTime(date);
        return currentDate >= startDate && currentDate <= endDate;
      });
    }
   // Method to go to the previous month
   goToPreviousMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(this.viewDate.getMonth() - 1);
    this.viewDate = newDate;
  }

  // Method to go to the next month
  goToNextMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(this.viewDate.getMonth() + 1);
    this.viewDate = newDate;
  }

  handleDayClick(day: { date: Date; events: EventModel[] }): void {
    if (day.events.length > 0) {
      this.selectedEvent = day.events[0]; // Select the first event for the day
    }
  }
  
  // Close the modal
  closeModal(): void {
    this.selectedEvent = null; // Clear the selected event to close the modal
  }
  generateDays(date: Date): { date: Date; events: EventModel[] }[] {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayEvents = this.getEventsForDay(new Date(d));
      days.push({ date: new Date(d), events: dayEvents });
    }
    return days;
  }
  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
