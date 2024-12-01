import { Component } from '@angular/core';
import { TouristPosition } from '../../stakeholders/model/tourist-position';
import { ProfileService } from '../../stakeholders/profile.service';
import { Person } from '../../stakeholders/model/person';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { EncounterService } from '../encounter.service';
import { UserLevelDto } from '../model/userLevel.model';

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
  constructor(private profileService: ProfileService, private authService: AuthService, private encounterService: EncounterService) {}
  showCompleteButton: boolean = false;
  currentEncounter: any = null; // Store the current encounter
  UserLevelDto: UserLevelDto | null = null;

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

  onProximityToMiscEncounter(encounter: any): void {
    if (encounter) {
      this.showCompleteButton = true;
      this.currentEncounter = encounter; // Store the encounter for further processing
      console.log('Proximity to Misc Encounter:', encounter);
    } else {
      this.showCompleteButton = false;
      this.currentEncounter = null;
      console.log('No Misc Encounter in proximity');
    }
  }
  

  onCompleteChallenge(): void {
    if (!this.currentEncounter || !this.user?.id) {
      console.error('No encounter or user ID available to complete the challenge.');
      return;
    }
  
    // Add the current user's ID to the touristIds array if not already present
    if (!this.currentEncounter.touristIds.includes(this.user.id)) {
      this.currentEncounter.touristIds.push(this.user.id);
    }
  
    // Update the encounter on the backend
    this.encounterService.updateMiscEncounter(this.currentEncounter).subscribe({
      next: updatedEncounter => {
        console.log('Encounter successfully updated:', updatedEncounter);
        this.showCompleteButton = false;
        this.currentEncounter = null; // Clear the current encounter

        // After the encounter update, update the user's level
        this.updateUserLevelOnChallengeCompletion();  // Call the method to update user leve
      },
      error: error => {
        console.error('Error updating encounter:', error);
      }
    });
  }



  updateUserLevelOnChallengeCompletion(): void {
    console.log('1');
    if (this.user && this.user.id) {
      console.log('9');
      // Try fetching the current user level
      this.encounterService.getUserLevel(this.user.id).subscribe({
        next: (userLevel: UserLevelDto) => {
          console.log('Fetched user level:', userLevel); // Log the entire userLevel object
          
          // Check for properties explicitly
          if (userLevel && userLevel.userId != undefined && userLevel.userId != null) {
            // Add XP (example: adding 10 XP to the current level)
            console.log('papak');
            const currentXp = userLevel.xp ?? 0; // Default to 0 if xp is undefined
            const newXp = currentXp + 10; // Adjust this as needed
            
            // Create a new object with the updated values
            const updatedLevelDto: UserLevelDto = {
              userId: userLevel.userId, // Keep the existing user ID
              id: userLevel.id,         // Keep the existing ID
              xp: newXp,                // Set the new XP
              level: this.calculateLevel(newXp), // Recalculate the level based on XP
            };
  
            console.log('Updated User Level:', updatedLevelDto);
            
            // Update the user level in the backend
            this.encounterService.updateUserLevel(updatedLevelDto).subscribe({
              next: (updatedLevel) => {
                console.log('User level updated:', updatedLevel);
              },
              error: (error) => {
                console.error('Error updating user level:', error);
              }
            });
          } else {
            console.error('User level data is invalid:', userLevel); // Log invalid case
          }
        },
        error: () => {
          console.log('2');
          // If the user level doesn't exist, create a new one
          this.UserLevelDto = {
            id: undefined, // Set Id as undefined if it's a new level
            userId: this.user!.id, // User ID
            xp: 10,  // Default XP (can be adjusted)
            level: this.calculateLevel(10), // Calculate level based on XP
          };
          console.log('New User Level:', this.UserLevelDto);
          // Create a new user level in the backend
          this.encounterService.updateUserLevel(this.UserLevelDto).subscribe({
            next: (createdLevel) => {
              console.log('New user level created:', createdLevel);
            },
            error: (error) => {
              console.error('Error creating new user level:', error);
            }
          });
        }
      });
    }
  }
  
  
  // Helper method to calculate the level based on XP (if needed)
  calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }
  

}
