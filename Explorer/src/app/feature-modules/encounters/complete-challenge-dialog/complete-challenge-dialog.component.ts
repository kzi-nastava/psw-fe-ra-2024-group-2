import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnifiedEncounterDto } from '../model/encounter.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { EncounterService } from '../encounter.service';
import { UserLevelDto } from '../model/userLevel.model';

@Component({
  selector: 'xp-complete-challenge-dialog',
  templateUrl: './complete-challenge-dialog.component.html',
  styleUrls: ['./complete-challenge-dialog.component.css'],
})
export class CompleteChallengeDialogComponent implements OnInit {
  user: any; // Replace with the correct user type if available
  UserLevelDto: UserLevelDto | null = null;

  constructor(
    public dialogRef: MatDialogRef<CompleteChallengeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private encounterService: EncounterService,
  ) {}

  ngOnInit(): void {
    // Fetch user details on component initialization
    this.authService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user)
    });
  }

  completeChallenge(): void {
    if (!this.data || !this.user?.id) {
      console.error('Incomplete data or user ID is missing.');
      return;
    }
    if (this.data.touristIds) {
      if (!this.data.touristIds.includes(this.user.id)) {
        this.data.touristIds.push(this.user.id);
      }
    }
    // Update the encounter on the backend
    if (this.data) {
      this.encounterService.updateMiscEncounter(this.data).subscribe({
        next: updatedEncounter => {
          console.log('Encounter successfully updated:', updatedEncounter);
        },
        error: error => {
          console.error('Error updating encounter:', error);
        }
      });
    }
    console.log('Challenge Completed:', this.data);
    this.updateUserLevelOnChallengeCompletion();
    this.dialogRef.close(true); // Close the dialog and return success
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

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog and return cancellation
  }
}
