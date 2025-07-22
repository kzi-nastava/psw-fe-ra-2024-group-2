import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Profile } from "../model/profile.model";
import { MatDialog } from "@angular/material/dialog";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserLevelDto } from "../../encounters/model/userLevel.model";
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { firstValueFrom } from 'rxjs';

@Component({
    selector: "xp-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
    profile: Profile | null = null; // To store the profile data
    user: User | undefined;

    level: UserLevelDto | null = null; // To store the user level data

    loading: boolean = true; // To manage loading state
    errorMessage: string | null = null; // To store error messages

    

    displayedColumns: string[] = ['username', 'name', 'lastName', 'email', 'biography', 'moto'];

    constructor(private profileService: ProfileService, public dialog: MatDialog, private snackBar: MatSnackBar,private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.getProfile();
        this.getLevel();
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

    async getLevel(): Promise<void> {
        try {
            const user = await this.getUser();
            if (!user?.id) {
                this.errorMessage = "User ID is missing.";
                return;
            }
    
            this.profileService.getUserLevel(user.id).subscribe({
                next: (level: UserLevelDto | null) => {
                    if (level) {
                        this.level = level;
                    } else {
                        this.level = {
                            id: 0, // Default or placeholder value
                            userId: user.id,
                            xp: 0,
                            level: 1,
                        };
                        this.errorMessage = "User level not found. Default level set.";
                    }
                    this.loading = false; 
                },
                error: (error) => {
                    this.errorMessage = "Failed to load user level. Please try again.";
                    console.error(error); 
                    this.loading = false;
                }
            });
        } catch (error) {
            this.errorMessage = "Unexpected error occurred while fetching user level.";
            console.error("Error fetching level:", error);
            this.loading = false;
        }
    }
    
    async getUser(): Promise<User | undefined> {
        try {
            const user = await firstValueFrom(this.authService.user$);
            this.user = user;
            console.log('User fetched:', user);
            return user;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return undefined;
        }
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
    viewMyDiaries(): void {
        if (!this.profile?.id) {
            this.errorMessage = "User ID is missing.";
            return;
        }
        console.log('User id ' + this.profile.id);
        this.router.navigate(['/diaries', this.profile.id]);
    }

    getXpProgress(): number {
        if (!this.level) return 0;
        const currentLevelBaseXp = (this.level.level - 1) * 100; // XP at the start of current level
        const xpInCurrentLevel = this.level.xp - currentLevelBaseXp; // XP earned in this level
        const xpRequiredForNextLevel = 100; // Fixed XP required per level
    
        return (xpInCurrentLevel / xpRequiredForNextLevel) * 100; // Progress in percentage
    }
    
    getNextLevel(): number {
        return this.level ? this.level.level + 1 : 1;
    }
    
    getNextLevelXp(): number {
        // Fixed XP required for each level
        return 100; 
    }
}

