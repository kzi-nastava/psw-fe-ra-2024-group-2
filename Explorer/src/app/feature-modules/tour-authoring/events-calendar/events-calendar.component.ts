import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventModel } from '../model/event.model';
import { PagedResult } from '../shared/model/tour.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.css']
})
export class EventsCalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Current month
  events: EventModel[] = []; // List of events
  selectedEvent: EventModel | null = null; // Track the selected event
  selectedHoliday: { name: string; description: string } | null = null;
  holidays: { date: Date; name: string; description: string }[] = [];

  supportedCountries = [
    { code: 'US', name: 'United States' },
    { code: 'RS', name: 'Serbia' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];
  
  selectedCountry = 'RS'; // Default to Serbia
  

  constructor(private service: TourAuthoringService, private http: HttpClient) {}

  private apiKey = 'duXyNSR9vGwRXMD8pni3AzTdanPONZbs'; // Replace with your API key
  private baseUrl = 'https://calendarific.com/api/v2/holidays';


  ngOnInit(): void {
    this.loadEvents();
    this.loadHolidays(this.viewDate.getFullYear());
  }


  viewHolidayDetails(holiday: { name: string; description: string }): void {
    this.selectedHoliday = holiday;
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

    loadHolidays(year: number): void {
      const url = `${this.baseUrl}?api_key=${this.apiKey}&country=${this.selectedCountry}&year=${year}`;
    
      this.http.get(url).subscribe({
        next: (response: any) => {
          this.holidays = response.response.holidays.map((holiday: any) => ({
            date: new Date(holiday.date.iso),
            name: holiday.name,
            description: holiday.description || 'No description available', // Include description here
          }));
        },
        error: (err: any) => {
          console.error('Error fetching holidays:', err);
        },
      });
    }
    
    onCountryChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      this.selectedCountry = target.value; // Update the selected country
      this.loadHolidays(this.viewDate.getFullYear()); // Reload holidays for the selected country
    }
        
    
    getEventsForDay(date: Date): EventModel[] {
      return this.events.filter(event => {
        const startDate = this.stripTime(event.startDate);
        const endDate = this.stripTime(event.endDate);
        const currentDate = this.stripTime(date);
        return currentDate >= startDate && currentDate <= endDate;
      });
    }
    goToPreviousMonth(): void {
      const newDate = new Date(this.viewDate);
      newDate.setMonth(this.viewDate.getMonth() - 1);
      this.viewDate = newDate;
    
      // Check if the year has changed, and fetch holidays accordingly
      const newYear = newDate.getFullYear();
      if (newYear !== this.viewDate.getFullYear()) {
        this.loadHolidays(newYear);
      }
    }
    
    goToNextMonth(): void {
      const newDate = new Date(this.viewDate);
      newDate.setMonth(this.viewDate.getMonth() + 1);
    
      // If crossing into a new year, reload holidays
      if (newDate.getFullYear() !== this.viewDate.getFullYear()) {
        this.loadHolidays(newDate.getFullYear());
      }
    
      this.viewDate = newDate;
    }

  handleDayClick(day: { date: Date; events: EventModel[] }): void {
    // if (day.events.length > 0) {
    //   this.selectedEvent = day.events[0]; // Select the first event for the day
    // }
  }
  
  // Close the modal
  closeModal(): void {
    this.selectedEvent = null; // Clear the selected event to close the modal
  }
  generateDays(date: Date): { date: Date; events: EventModel[]; holiday?: { name: string; description: string } }[] {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];
  
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayEvents = this.getEventsForDay(new Date(d));
      const holiday = this.holidays.find(
        (h) => this.stripTime(h.date).getTime() === this.stripTime(d).getTime()
      );
      days.push({
        date: new Date(d),
        events: dayEvents,
        holiday: holiday ? { name: holiday.name, description: holiday.description } : undefined,
      });
    }
    return days;
  }
  closeHolidayModal(): void {
    this.selectedHoliday = null;
  }
  
  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  viewEventDetails(event: EventModel, eventClick: MouseEvent): void {
    eventClick.stopPropagation(); // Prevent the parent click from triggering
    this.selectedEvent = event; // Set the clicked event as selected
  }
}
