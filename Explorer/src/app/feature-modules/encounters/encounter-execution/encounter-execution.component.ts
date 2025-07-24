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
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-encounter-execution',
  templateUrl: './encounter-execution.component.html',
  styleUrls: ['./encounter-execution.component.css'],
  animations: [
    trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
            animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
        ])
    ]),
    trigger('slideIn', [
        transition(':enter', [
            style({ transform: 'translateX(-20px)', opacity: 0 }),
            animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
        ])
    ])
]
})
export class EncounterExecutionComponent {
  touristPosition: TouristPosition | null = null;
  person: Person | null = null;
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  dialogOpened: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  showCompleteButton: boolean = false;
  constructor(
    private profileService: ProfileService,
     private authService: AuthService, 
     private encounterService: EncounterService,
     private dialog: MatDialog,
     private snackBar: MatSnackBar,
  ) { }

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
    this.dialogOpened = true;
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpened = false;
      if(result){
        if(encounter.encounterType == "Misc"){
        this.showSuccess('Challenge completed!');
        }else if(encounter.encounterType == "Social"){
          this.showSuccess('You entered Social encounter!');
        }else if(encounter.encounterType == "HiddenLocation"){
          this.showSuccess('You completed Hidden encounter!');
        }
      }
    })
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
    });
  }

  onCompleteChallenge(): void {
    // Hide the complete button after clicking
    this.showCompleteButton = false;
    this.showSuccess('Challenge completed successfully!');
    console.log('Challenge completion triggered');
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
      if(this.user?.id && this.dialogOpened == false && !encounter.touristIds.includes(this.user.id)){
        this.openChallengeDialog(encounter);
      }else{
        console.log("You are already in this encounter!");
        console.log(encounter.touristIds);
      }
    } else {
      console.log('No Social Encounter in proximity');
    }
  }
  onProximityToHiddenEncounter(encounter: any): void {
    if (encounter) {
      if(this.user?.id && this.dialogOpened == false && !encounter.touristIds.includes(this.user.id)){
        console.log('yes Hidden Encounter in proximity');
        this.openChallengeDialog(encounter);
      }else{
        this.showSuccess('This encounter is already completed!')
        console.log("You are already in this encounter!");
      }
    } else {
      console.log('No Hidden Encounter in proximity');
    }
  }
  onProximityToMiscEncounter(encounter: any): void {
    if (encounter) {
      if(this.user?.id && !encounter.touristIds.includes(this.user.id) && this.dialogOpened == false){
        this.openChallengeDialog(encounter);
      }else{
        this.showSuccess('This encounter is already completed!')
        console.log("You already completed this encounter!");
      }
      console.log('Proximity to Misc Encounter:', encounter);
    } else {
      console.log('No Misc Encounter in proximity');
    }
  }
  noProximityToSocialEncounter(number: any): void {
    if(!this.user?.id){
      console.error('User ID is not defined.');
      return;
    }
    console.log('No Social Encounter in proximity');
    this.encounterService.removeUserFromSocialEncounters(this.user?.id).subscribe({
      next: () => {
        console.log('User removed from social encounters');
      },
      error: (error) => {
        console.error('Error removing user from social encounters:', error);
      }
    })
  }
}
