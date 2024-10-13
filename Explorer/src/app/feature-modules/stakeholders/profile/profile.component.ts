import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Profile } from "../model/profile.model";

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

    constructor(private profileService: ProfileService) {}

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
}
