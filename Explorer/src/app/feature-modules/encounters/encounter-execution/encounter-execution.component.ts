import { Component } from '@angular/core';
import { TouristPosition } from '../../stakeholders/model/tourist-position';
import { ProfileService } from '../../stakeholders/profile.service';
import { Person } from '../../stakeholders/model/person';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-encounter-execution',
  templateUrl: './encounter-execution.component.html',
  styleUrls: ['./encounter-execution.component.css']
})
export class EncounterExecutionComponent {
  touristPosition: TouristPosition | null = null;
  person : Person | null = null;
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  constructor(private profileService: ProfileService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user?.id) {
        // Retrieve the current position for the user on initialization
        this.profileService.getTouristPosition(this.user.id).subscribe({
          next: (per: Person) => {
            this.person = per;
            this.touristPosition = per.touristPosition;
            console.log('Retrieved Tourist Position:', this.touristPosition);
          },
          error: (error) => {
            console.error('Error retrieving tourist position:', error);
          }
        });
      } else {
        console.error('User ID is not defined.');
      }
    });
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

  onLocationSelected(event: {lat: number, lng: number}): void {
    const { lat, lng } = event;
    this.touristPosition = { latitude: lat, longitude: lng };
    console.log('New Tourist Position:', this.touristPosition);

    // Call the updateTouristPosition method to update the person's location
    if (this.user?.id && this.touristPosition) {
      this.profileService.updateTouristPosition(this.user.id, this.touristPosition).subscribe({
        next: (updatedPerson: Person) => {
          console.log('Updated Person Position:', updatedPerson);
        },
        error: (error) => {
          console.error('Error updating tourist position:', error);
        }
      });
    } else {
      console.error('User ID or tourist position is not defined.');
    }
    
  }

}
