import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TouristPosition } from '../model/tourist-position';
import { ProfileService } from '../profile.service';
import { Person } from '../model/person';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { TourExecution } from '../../tour-execution/model/tourExecution-model';
import { Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { ChangeDetectorRef } from '@angular/core';
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
           // console.log('Retrieved Tourist Position:', this.touristPosition);
           // console.log('Retrieved Person:', this.person);
            this.startPositionCheckInterval(); 
          },
          error: (error) => {
            console.error('Error retrieving tourist position:', error);
          }
        });
        this.execService.loadTourExecution(this.user.id).subscribe({next: (execution: TourExecution) => {
          this.tourExecution = execution;
          //console.log("Tour Execution:", this.tourExecution);
          this.updateCheckpoints();
        }});
      } else {
        console.error('User ID is not defined.');
      }
    });
  }

  updateCheckpoints(): void {
    console.log("Da li udjes posle brisanaj checkpointa")
    const checkpointIds = this.tourExecution.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt === null)
          .map(checkpoint => checkpoint.checkpointId);
        
        //console.log("Checkpoint IDs with null ArrivalAt:", checkpointIds);
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.executedCheckpoints = checkpoints.results;
              console.log("Checkpoints:", this.executedCheckpoints);
             this.checkpointCordinates =  this.getCheckpointCoordinates();
             console.log("Checkpoints coordinates:", this.checkpointCordinates);
            },
            error: (error) => {
              console.error('Error fetching checkpoints:', error);
          }});
  }




  getCheckpointCoordinates(): { latitude: number, longitude: number }[] {


    if (!this.touristPosition || !this.tourExecution) {
      return [];
    }
    //console.log("Tourist position:", this.touristPosition);
    return [
      { latitude: this.touristPosition.latitude, longitude: this.touristPosition.longitude },
      ...this.executedCheckpoints
        .map(checkpoint => ({
          latitude: checkpoint.latitude,
          longitude: checkpoint.longitude
        }))
    ];
  }



  startPositionCheckInterval(): void {
    this.intervalId = setInterval(() => {
      const storedPosition = JSON.parse(localStorage.getItem('touristPosition') || '{}');
      console.log("Vreme tajmer")
      //console.log('Proveravam trenutnu lokaciju:', storedPosition)
      //console.log('Trenutna lokacija:', storedPosition)
      //console.log('Lokacija turiste:', this.touristPosition)
      if (storedPosition.latitude !== this.touristPosition?.latitude || storedPosition.longitude !== this.touristPosition?.longitude) {
        this.updateTouristPosition();
      }
    }, 10000); 
  }

  clearMarkers(){
    this.clearMarkersFlag = true;
  }
  onMarkersCleared(): void {
    console.log('Markers cleared in the map component');
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
    console.log('Tourist position updated locally:', this.touristPosition);

  }

  updateTouristPosition(): void {
    if (this.user?.id && this.touristPosition) {
      this.service.updateTouristPosition(this.user.id, this.touristPosition).subscribe({
        next: (updatedPerson: Person) => {
          this.touristPosition = updatedPerson.touristPosition;
          console.log('A sto ne udjes ovde ako si updated:', this.touristPosition);

          localStorage.setItem('touristPosition', JSON.stringify(this.touristPosition));
        },
        error: (error) => {
          console.error('Error updating tourist position:', error);
        }
      });
      console.log('Checking tourist position:', this.touristPosition);
      this.execService.checkTouristPosition(this.touristPosition).subscribe({
        next: (currentExe: TourExecution) => {
          console.log('Current exe after saving:', currentExe);
          // KOMPARACIJA OVDE
          const checkpointIds = currentExe.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt !== null)
          .map(checkpoint => checkpoint.checkpointId);
          
        //console.log("Checkpoint IDs with null ArrivalAt:", checkpointIds);
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.currentExeCheckpoints = checkpoints.results;
              console.log("TAJNA: ");
              this.currentExeCheckpoints.forEach(ch => {
                console.log(ch.secret);
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
    }
  }

  showSecret(sec: any): void{
    this.secret = sec;
    //this.cdr.detectChanges(); // Trigger change detection
  }

  endTour(): void {
    this.execService.endTour(this.tourExecution).subscribe({
      next: (execution: TourExecution) => {
        console.log('Tour ended:', execution);
        this.tourExecution = execution;
        this.updateCheckpoints();
        this.router.navigate(['/']); // Navigate on success
      },
      error: (error) => {
        console.error('Error ending tour:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

