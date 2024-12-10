import { Component } from '@angular/core';
import { TouristPosition } from '../../stakeholders/model/tourist-position';
import { ProfileService } from '../../stakeholders/profile.service';
import { Person } from '../../stakeholders/model/person';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { EncounterService } from '../encounter.service';
import { UserLevelDto } from '../model/userLevel.model';
import { MatDialog } from '@angular/material/dialog';
import { CompleteChallengeDialogComponent } from '../complete-challenge-dialog/complete-challenge-dialog.component';

@Component({
  selector: 'xp-encounter-execution',
  templateUrl: './encounter-execution.component.html',
  styleUrls: ['./encounter-execution.component.css']
})
export class EncounterExecutionComponent {
  touristPosition: TouristPosition | null = null;
  person: Person | null = null;
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  constructor(
    private profileService: ProfileService,
     private authService: AuthService, 
     private encounterService: EncounterService,
     private dialog: MatDialog
  ) { }
  showCompleteButton: boolean = false;
  socialEncounter: any = null;
  hiddenEncounter: any = null;
  miscEncounter: any = null;
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

  clearMarkers() {
    this.clearMarkersFlag = true;
  }
  onMarkersCleared(): void {
    console.log('Markers cleared in the map component');
    setTimeout(() => {
      this.clearMarkersFlag = false;
    });
  }

  openChallengeDialog(encounter: any): void{
    const dialogRef = this.dialog.open(CompleteChallengeDialogComponent, {
      width: '600px',
      data: { ...encounter },
      panelClass: 'custom-dialog'
  });
  }

  onLocationSelected(event: { lat: number, lng: number }): void {
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
  onProximityToSocialEncounter(encounter: any): void {
    if (encounter) {
      console.log("KITA 2")
      this.socialEncounter = encounter;
      this.onCompleteChallenge();
    } else {
      this.socialEncounter = null;
      console.log('No Social Encounter in proximity');
    }
  }
  onProximityToHiddenEncounter(encounter: any): void {
    if (encounter) {
      console.log("KITA 3")
      this.hiddenEncounter = encounter;
      console.log('yes Hidden Encounter in proximity');
      this.onCompleteChallenge();
    } else {
      this.hiddenEncounter = null;
      console.log('No Hidden Encounter in proximity');
    }
  }
  onProximityToMiscEncounter(encounter: any): void {
    if (encounter) {
      if(this.user?.id && !encounter.touristIds.includes(this.user.id)){
        this.openChallengeDialog(encounter);
      }
      console.log("KITA 1")
      this.showCompleteButton = true;
      this.miscEncounter = encounter; // Store the encounter for further processing
      console.log('Proximity to Misc Encounter:', encounter);
    } else {
      this.showCompleteButton = false;
      this.miscEncounter = null;
      console.log('No Misc Encounter in proximity');
    }
  }
  noProximityToSocialEncounter(number: any): void {
    console.log("kita 5")
    if(!this.user?.id){
      console.error('User ID is not defined.');
      return;
    }
    console.log('No Social Encounter in proximity');
    this.socialEncounter = null;
    this.encounterService.removeUserFromSocialEncounters(this.user?.id).subscribe({
      next: () => {
        console.log('User removed from social encounters');
      },
      error: (error) => {
        console.error('Error removing user from social encounters:', error);
      }
    })
  }

  onCompleteChallenge(): void {
    if (!this.miscEncounter && !this.hiddenEncounter && !this.socialEncounter || !this.user?.id) {
      console.error('No encounter or user ID available to complete the challenge.');
      return;
    }

    // Add the current user's ID to the touristIds array if not already present
    if (this.miscEncounter) {
      if (!this.miscEncounter.touristIds.includes(this.user.id)) {
        this.miscEncounter.touristIds.push(this.user.id);
      }
    }
    if (this.hiddenEncounter) {
      if (!this.hiddenEncounter.touristIds.includes(this.user.id)) {
        this.hiddenEncounter.touristIds.push(this.user.id);
      }
    }
    if (this.socialEncounter) {

      if (!this.socialEncounter.touristIds.includes(this.user.id)) {
        this.socialEncounter.touristIds.push(this.user.id);
      }
    }

    // Update the encounter on the backend
    if (this.miscEncounter) {
      this.encounterService.updateMiscEncounter(this.miscEncounter).subscribe({
        next: updatedEncounter => {
          console.log('Encounter successfully updated:', updatedEncounter);
          this.showCompleteButton = false;
          this.miscEncounter = null; // Clear the current encounter

          // After the encounter update, update the user's level
          this.updateUserLevelOnChallengeCompletion();  // Call the method to update user leve
        },
        error: error => {
          console.error('Error updating encounter:', error);
        }
      });
    }
    else if (this.socialEncounter) {
      this.encounterService.updateSocialEncounter(this.socialEncounter).subscribe({
        next: updatedEncounter => {
          console.log('Encounter successfully updated:', updatedEncounter);
          this.socialEncounter = null;
        },
        error: error => {
          console.error('Error updating encounter:', error);
        }
      });
    }
    else if (this.hiddenEncounter) {

      this.encounterService.updateHiddenEncounter(this.hiddenEncounter).subscribe({
        next: updatedEncounter => {
          console.log('Encounter successfully updated:', updatedEncounter);
          this.hiddenEncounter = null;

          this.updateUserLevelOnChallengeCompletion();
        },
        error: error => {
          console.error('Error updating encounter:', error);
        }
      });
    }
  }
  updateUserLevelOnChallengeCompletion(): void {
    if (this.user && this.user.id) {
      this.encounterService.getUserLevel(this.user.id).subscribe({
        next: (userLevel: UserLevelDto) => {
          if (userLevel && userLevel.userId != undefined && userLevel.userId != null) {
            const currentXp = userLevel.xp ?? 0;
            const newXp = currentXp + 10;

            const updatedLevelDto: UserLevelDto = {
              userId: userLevel.userId,
              id: userLevel.id,
              xp: newXp,
              level: this.calculateLevel(newXp),
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
          this.UserLevelDto = {
            id: undefined,
            userId: this.user!.id,
            xp: 10,
            level: this.calculateLevel(10),
          };
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
  calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }
}
