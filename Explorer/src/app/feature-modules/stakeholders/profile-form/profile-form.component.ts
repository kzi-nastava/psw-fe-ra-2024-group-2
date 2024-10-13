import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Profile } from "../model/profile.model";

@Component({
    selector: "xp-profile-form",
    templateUrl: "./profile-form.component.html",
    styleUrls: ["./profile-form.component.css"],
})
export class ProfileFormComponent implements OnInit {
    profileForm: FormGroup;
    selectedImage: File | null = null; // To store the selected image file

    constructor(public dialogRef: MatDialogRef<ProfileFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Profile) {
        this.profileForm = new FormGroup({
            username: new FormControl("", Validators.required),
            name: new FormControl("", Validators.required),
            lastName: new FormControl("", Validators.required),
            email: new FormControl("", [Validators.required, Validators.email]),
            biography: new FormControl(""),
            moto: new FormControl(""),
            image: new FormControl(""),
        });
    }

    ngOnInit(): void {
        if (this.data) {
            this.profileForm.patchValue(this.data);
        }
    }

    onFileSelect(event: any): void {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type from base64 string
                const uploadedAt = new Date().toISOString(); // Get the current date and time
                this.profileForm.patchValue({ image: { data: base64String, mimeType, uploadedAt } }); // Update the form control with base64 string
                this.profileForm.get('image')!.updateValueAndValidity();
            };
            reader.readAsDataURL(file); // Convert file to DataURL (base64 encoded string)
        }
    }

    onSave(): void {
        const formData = { ...this.profileForm.value };
        this.dialogRef.close(formData); // Return form data including image
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
