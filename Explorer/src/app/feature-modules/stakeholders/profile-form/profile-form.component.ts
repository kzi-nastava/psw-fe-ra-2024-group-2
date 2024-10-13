import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "xp-profile-form",
    templateUrl: "./profile-form.component.html",
    styleUrls: ["./profile-form.component.css"],
})
export class ProfileFormComponent {
    profileForm: FormGroup;
    selectedImage: File | null = null; // To store the selected image file
}
