import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Profile } from "../model/profile.model";
import { MatDialog } from "@angular/material/dialog";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "xp-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
    profile: Profile | null = null; // To store the profile data

    loading: boolean = true; // To manage loading state
    errorMessage: string | null = null; // To store error messages

    displayedColumns: string[] = ['username', 'name', 'lastName', 'email', 'biography', 'moto'];

    constructor(private profileService: ProfileService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.getProfile();
    }

    getProfile(): void {
        this.profileService.getProfile().subscribe({
            next: (profile: Profile) => {
                this.profile = profile;
                this.loading = false; // Set loading to false on successful fetch
            },
            error: (error) => {
                this.errorMessage = "Failed to load profile. Please try again."; // Set error message
                console.error(error); // Log the error for debugging
                this.loading = false; // Ensure loading is false on error
            }
        });
    }

    openEditDialog(): void {
        if (!this.profile) return; // Ensure profile data is available

        const dialogRef = this.dialog.open(ProfileFormComponent, {
            width: '600px',
            data: { ...this.profile }
        });

        dialogRef.afterClosed().subscribe((result: Profile) => {
            if (result) {
                this.profileService.updateProfile(result).subscribe({
                    next: () => {
                        this.getProfile(); // Reload profile data on successful update
                        this.showSuccessSnackbar(); // Show success message
                    },
                    error: (error) => {
                        this.errorMessage = "Failed to update profile. Please try again."; // Set error message
                        this.showErrorSnackbar(); // Show error message
                    }
                });
            }
        });
    }

    showSuccessSnackbar(): void {
        this.snackBar.open("Profile saved successfully", "Close", {
            duration: 3000,
            verticalPosition: 'bottom', // Positioning
            horizontalPosition: 'right', // Positioning
            panelClass: ['snackbar-success'], // Custom CSS class
        });
    }

    showErrorSnackbar(): void {
        this.snackBar.open("Failed to save profile", "Close", {
            duration: 3000,
            verticalPosition: 'bottom', // Positioning
            horizontalPosition: 'right', // Positioning
            panelClass: ['snackbar-error'], // Custom CSS class
        });
    }
}
