import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TouristPosition } from '../model/tourist-position';
import { ProfileService } from '../profile.service';
import { Person } from '../model/person';
import { Chapter } from '../../tour-execution/model/chapter.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { TourExecution } from '../../tour-execution/model/tourExecution-model';
import { Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { ChangeDetectorRef } from '@angular/core';
import { PagedResult } from '../../blog/blog.module';
import { EventModel } from '../../tour-authoring/model/event.model';
@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent {
  touristPosition: TouristPosition | null = null;
  person: Person | null = null;
  tourExecution: TourExecution; 
  executedCheckpoints : any[] = [];
  checkpointCordinates: any[] = [];
  currentExeCheckpoints: any[] = [];
  checkpoints: Checkpoint[] = [];
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  intervalId: any;
  secret: string | null = null;
  events: any[] = [];
  personalDiaryId: number | null = null;
  newChapter: Chapter = {
    chapterId: 0,
    title: '',
    createdAt: new Date(),
    text: '',
    personalDairyId: 0,
  };
  constructor(private service: ProfileService, private authService: AuthService, private execService: TourExecutionService, private router: Router,  private cdr: ChangeDetectorRef  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user?.id) {
        this.service.getTouristPosition(this.user.id).subscribe({
          next: (per: Person) => {
            this.person = per;
            this.touristPosition = per.touristPosition;
            localStorage.setItem('touristPosition', JSON.stringify(this.touristPosition));
            this.startPositionCheckInterval(); 
          },
          error: (error) => {
            console.error('Error retrieving tourist position:', error);
          }
        });
        this.execService.loadTourExecution(this.user.id).subscribe({next: (execution: TourExecution) => {
          this.tourExecution = execution;
          this.updateCheckpoints();
        }});
        this.getDiaryForUser();
      } else {
        console.error('User ID is not defined.');
      }
    });
  }

  updateCheckpoints(): void {
    const checkpointIds = this.tourExecution.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt === null)
          .map(checkpoint => checkpoint.checkpointId);
        
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.executedCheckpoints = checkpoints.results;
             this.checkpointCordinates =  this.getCheckpointCoordinates();
            },
            error: (error) => {
              console.error('Error fetching checkpoints:', error);
          }});
  }




  getCheckpointCoordinates(): { latitude: number, longitude: number }[] {

    if (!this.touristPosition || !this.tourExecution) {
      return [];
    }
    return [
      { latitude: this.touristPosition.latitude, longitude: this.touristPosition.longitude, name : this.person?.name || 'Tourist', surname : this.person?.surname || '' },
      ...this.executedCheckpoints
    ];
  }



  startPositionCheckInterval(): void {
    this.intervalId = setInterval(() => {
      const storedPosition = JSON.parse(localStorage.getItem('touristPosition') || '{}');
      if (storedPosition.latitude !== this.touristPosition?.latitude || storedPosition.longitude !== this.touristPosition?.longitude) {
        this.updateTouristPosition();
      }
    }, 10000); 
  }

  clearMarkers(){
    this.clearMarkersFlag = true;
  }
  onMarkersCleared(): void {
    setTimeout(() => {
      this.clearMarkersFlag = false; 
    });
  }

  onLocationSelected(event: { lat: number; lng: number }): void {
    const { lat, lng } = event;

    if(!this.touristPosition)
    {
      this.touristPosition = { latitude: lat, longitude: lng };
      this.updateTouristPosition();
    }

    this.touristPosition = { latitude: lat, longitude: lng };

  }

  updateTouristPosition(): void {
    if (this.user?.id && this.touristPosition) {
      this.service.updateTouristPosition(this.user.id, this.touristPosition).subscribe({
        next: (updatedPerson: Person) => {
          this.touristPosition = updatedPerson.touristPosition;
          localStorage.setItem('touristPosition', JSON.stringify(this.touristPosition));
        },
        error: (error) => {
          console.error('Error updating tourist position:', error);
        }
      });
      this.execService.checkTouristPosition(this.touristPosition).subscribe({
        next: (currentExe: TourExecution) => {
          // KOMPARACIJA OVDE
          const checkpointIds = currentExe.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt !== null)
          .map(checkpoint => checkpoint.checkpointId);
          
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.currentExeCheckpoints = checkpoints.results;
              this.currentExeCheckpoints.forEach(ch => {
                if(this.secret != ch.secret){
                  this.secret = ch.secret;
                }
              });
              this.currentExeCheckpoints = [];
            },
            error: (error) => {
              console.error('Error fetching checkpoints:', error);
          }});

          this.tourExecution = currentExe; 
          this.updateCheckpoints();
          
        },
        error: (error) => {
          console.error('Error checking tourist position:', error);
        }

      });
      this.execService.GetAllEventsWithinRange(this.touristPosition).subscribe({
        next: (result : PagedResult<EventModel>) => {
          console.log(result);
          this.events = result.results;
          console.log(this.events);
        }
      });
    }
  }


  joinEvent(event: EventModel): void {

    this.execService.acceptEvent(event).subscribe({
      next: (response) => {
        console.log('Tour started successfully!', response);
        this.router.navigate(['/position-simulator']);
      },
      error: (error) => {
        console.error('Failed to start the tour:', error);
      }
    });

  }
  showSecret(sec: any): void{
    this.secret = sec;
    //this.cdr.detectChanges(); // Trigger change detection
  }

  endTour(): void {
    this.execService.endTour(this.tourExecution).subscribe({
      next: (execution: TourExecution) => {
        this.tourExecution = execution;
        this.updateCheckpoints();
        this.router.navigate(['/']); // Navigate on success
      },
      error: (error) => {
        console.error('Error ending tour:', error);
      }
    });
  }
  getDiaryForUser() {
    if (this.user?.id !== undefined) {
      this.execService.getDiaryForExecution(this.user.id).subscribe({
        next: (data) => {
          if (data && data.length > 0) { // Proveravamo da li niz ima podatke
            const diary = data[0]; // Pristupamo prvom elementu niza
            this.personalDiaryId = diary.id;
            console.log('Dnevnik ID:', this.personalDiaryId);
          } else {
            console.error('API je vratio prazan niz!');
          }
        },
        error: (err) => {
          console.error('Greška prilikom poziva API-ja:', err);
        }
      });
    }
  }
  
  

  submitChapter() {
    if (!this.personalDiaryId) {
      alert('Dnevnik nije pronađen za trenutnog korisnika!');
      alert(this.personalDiaryId);
      return;
    }
  
    this.newChapter.personalDairyId = this.personalDiaryId;
  
    this.execService.addChapter(this.personalDiaryId, this.newChapter).subscribe({
      next: (response) => {
        console.log('Poglavlje uspešno dodato:', response);
        alert('Poglavlje je dodato u dnevnik!');
        this.resetFields();
      },
      error: (err) => {
        console.error('Greška prilikom dodavanja poglavlja:', err);
        alert('Došlo je do greške!');
      },
    });
  }
  /*resetForm(form: any): void {
    this.newChapter = {
      chapterId: 0,
      title: '',
      createdAt: new Date(),
      text: '',
      personalDairyId: 0,
    };

    form.reset();  // Resetuje samu formu
  }*/
    resetFields(): void {
      this.newChapter.title = '';
      this.newChapter.text = '';
    }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

