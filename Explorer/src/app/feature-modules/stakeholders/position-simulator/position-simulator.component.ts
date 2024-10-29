import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TouristPosition } from '../model/tourist-position';
import { ProfileService } from '../profile.service';
import { Person } from '../model/person';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';



@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent {
  touristPosition: TouristPosition | null = null;
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  constructor(private service: ProfileService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user?.id) {
        // Retrieve the current position for the user on initialization
        this.service.getTouristPosition(this.user.id).subscribe({
          next: (position: TouristPosition) => {
            this.touristPosition = position;
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
      this.service.updateTouristPosition(this.user.id, this.touristPosition).subscribe({
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

