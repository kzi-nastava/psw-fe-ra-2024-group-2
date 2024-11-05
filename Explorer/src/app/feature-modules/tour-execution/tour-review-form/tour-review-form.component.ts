import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.scss']
})
export class TourReviewFormComponent implements OnInit {
  tourReviewForm: FormGroup;
  tourId: number | null = null;
  selectedImage: File | null = null; // To store the selected image file
  imagePreview: string | ArrayBuffer | null = null; // Variable to hold the base64 preview

  constructor( private snackBar: MatSnackBar,private fb: FormBuilder, private route: ActivatedRoute, private service: TourExecutionService,  private router: Router) {
    this.tourReviewForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      reviewDate: ['', Validators.required],
      visitDate: ['', Validators.required],
      userId: [null],  // Will be populated dynamically
      tourId: [null],   // Will be populated dynamically
      image: ['']       // Add an image control to the form
      
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tourIdParam = params.get('tourId');
      if (tourIdParam) {
        this.tourId = +tourIdParam;
        this.tourReviewForm.patchValue({ tourId: this.tourId });
      }
    });

    const userId = 1;  // Simulating userId retrieval
    this.tourReviewForm.patchValue({ userId });
  }

  // Method to handle file selection and update the form with base64 image data
  onFileSelect(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type from base64 string
        const uploadedAt = new Date().toISOString(); // Get the current date and time

        // Update the form control with base64 string
        this.tourReviewForm.patchValue({ image: { data: base64String, mimeType, uploadedAt } });
        this.tourReviewForm.get('image')!.updateValueAndValidity();

        this.imagePreview = base64String; // Set the preview to the base64 string
      };
      reader.readAsDataURL(file); // Convert file to DataURL (base64 encoded string)
    }
  }

  // Method to submit the review form
  onSubmit(): void {
    if (this.tourReviewForm.valid) {
      const review: TourReview = {
        grade: this.tourReviewForm.value.grade,
        comment: this.tourReviewForm.value.comment,
        userId: this.tourReviewForm.value.userId,
        tourId: this.tourReviewForm.value.tourId,
        image: this.tourReviewForm.value.image,  // Include the image data
        reviewDate: this.tourReviewForm.value.reviewDate,
        visitDate: this.tourReviewForm.value.visitDate,
        progress: 0
      };

      this.service.addReview(review).subscribe({
        next: (response) => {
          console.log('Review added successfully:', response);
          this.router.navigate(['/alltours']); // Redirect to the tours view after submission
        },
        error: (err) => {
          if (err.status === 400) {
            this.snackBar.open('You are not able to leave a review', 'Close', {
              duration: 3000,
              panelClass: ['red-snackbar']
            });
          }
          console.error('You do not have qualifications to update review for this tour.', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Utility method to check if a field is invalid and touched
  isFieldInvalid(field: string): boolean {
    const control = this.tourReviewForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
