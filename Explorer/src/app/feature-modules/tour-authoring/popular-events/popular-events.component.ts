import { Component } from '@angular/core';
import { EventModel } from '../model/event.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MatDialog } from '@angular/material/dialog';
import { PagedResult } from '../shared/model/tour.module';
import { Router } from '@angular/router';
import { EventSubscription } from '../model/eventSubscription.model';


export enum EventCategory {
  Concert = 0,
  MusicFestival = 1,
  FilmFestival = 2,
  FootballMatch = 3,
  BasketballMatch = 4,
}

@Component({
  selector: 'xp-popular-events',
  templateUrl: './popular-events.component.html',
  styleUrls: ['./popular-events.component.css']
})
export class PopularEventsComponent {
  events: EventModel[] = []

  eventCategories = [
    { label: 'Concert', value: 0 },
    { label: 'Music Festival', value: 1 },
    { label: 'Film Festival', value: 2 },
    { label: 'Football Match', value: 3 },
    { label: 'Basketball Match', value: 4 },
  ];
  selectedCategories: number[] = []; // Niz odabranih integer vrednosti
  selectedCategory: string = '';
  filteredEvents: any[] = []; // Pretpostavka da ovo puniš iz API-ja ili lokalno
  subscriptionSuccess: boolean = false;
  

  onCheckboxChange(event: any): void {
    const value = +event.target.value; // Konvertuje vrednost u broj
    if (event.target.checked) {
      if (!this.selectedCategories.includes(value)) {
        this.selectedCategories.push(value); // Dodaje u niz
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter((v) => v !== value); // Uklanja iz niza
    }
  
    //console.log('Updated selected categories:', this.selectedCategories); // Za debagovanje
  }
  
  
  constructor(private service: TourAuthoringService, private dialog: MatDialog, private router: Router) {}


  ngOnInit(): void {
    this.getEvents();
    this.GetSubs();
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
  subscribeToCategories(): void {
    this.service.subscribeEvent(this.selectedCategories).subscribe({
      next: (result: PagedResult<EventModel>) => {
        this.subscriptionSuccess = true;
        this.filteredEvents = result.results;
  
        // Mapiranje kategorija za prikazivanje
        this.selectedCategories = this.selectedCategories.map(value =>
          this.eventCategories.find(category => category.value === value)?.value || value
        );
      },
      error: (err) => {
        console.error('Error subscribing:', err);
      },
    });
  }
  
  getCategoryLabel(categoryValue: number): string {
    const category = this.eventCategories.find(c => c.value === categoryValue);
    return category ? category.label : 'Unknown';
  }

  unsubscribeFromCategories(): void {
    // Resetuje odabrane kategorije
    this.selectedCategories = [];
  
    // Resetuje checkbox-ove
    this.eventCategories.forEach(category => {
      const checkbox = document.querySelector(`input[type="checkbox"][value="${category.value}"]`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false; // Poništava checkbox
      }
    });
  
    // Resetuje filtrirane događaje
    this.filteredEvents = [];
  
    // Backend poziv za odjavu
    this.service.unsubscribeEvent().subscribe({
      next: () => {
        this.subscriptionSuccess = false; // Skidanje "Subscription success" poruke
      },
      error: (err) => {
        console.error('Error unsubscribing:', err);
      }
    });
  }
  
  GetSubs(): void {
    this.service.GetSubscriptions().subscribe({
      next: (response: any) => {
        this.selectedCategories = response.results;
        this.subscriptionSuccess = this.selectedCategories.length > 0; // Aktiviraj poruku
        // Automatski postavi checkboxove
        this.loadSubscribedEvents();
        this.eventCategories.forEach((category) => {
          const checkbox = document.querySelector(`input[type="checkbox"][value="${category.value}"]`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = this.selectedCategories.includes(category.value);
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading subscribed categories:', err);
      }
    });
  }

  loadSubscribedEvents(): void {
    this.service.loadSubscribedEvents(this.selectedCategories).subscribe({
      next: (result: PagedResult<EventModel>) => {
        this.subscriptionSuccess = true;
        this.filteredEvents = result.results;
  
        // Mapiranje kategorija za prikazivanje
        this.selectedCategories = this.selectedCategories.map(value =>
          this.eventCategories.find(category => category.value === value)?.value || value
        );
      },
      error: (err) => {
        console.error('Error subscribing:', err);
      },
    })
  }



  filterEvents(): void {
    if (this.selectedCategory) {
      this.filteredEvents = this.events.filter(
        (event) => event.category === this.selectedCategory
      );
    } else {
      this.filteredEvents = [];
    }
  }
}
