import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Profile } from "../model/profile.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "xp-profile-form",
    templateUrl: "./profile-form.component.html",
    styleUrls: ["./profile-form.component.css"],
})
export class ProfileFormComponent implements OnInit {
    profileForm: FormGroup;
    selectedImage: File | null = null; // To store the selected image file
    imagePreview: string | ArrayBuffer | null = null; // Variable to hold the base64 preview

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

        let imageData = data.image?.data;

        if (imageData) {
            this.imagePreview = imageData;
        }
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

                this.imagePreview = base64String; // Set the preview to the base64 string
            };
            reader.readAsDataURL(file); // Convert file to DataURL (base64 encoded string)
        }
    }

    onSave(): void {
        if(!this.profileForm.valid) return; // Ensure form is valid before proceeding
        
        const formData = { ...this.profileForm.value };
        this.dialogRef.close(formData); // Return form data including image
    }

    onCancel(): void {
        this.dialogRef.close();
    }


}
