import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})
export class TourReviewFormComponent implements OnInit {
  tourReviewForm: FormGroup;
  tourId: number | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: TourExecutionService) {
    this.tourReviewForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      reviewDate: ['', Validators.required],
      visitDate: ['', Validators.required],
      userId: [null],  // Will be populated dynamically
      tourId: [null]   // Will be populated dynamically
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

    
    const userId = 1; 
    this.tourReviewForm.patchValue({ userId });
  }

  onSubmit() {
    if (this.tourReviewForm.valid) {
      const reviewData = this.tourReviewForm.value;
      console.log('Review Submitted:', reviewData);
    } else {
      console.log('Form is invalid');
    }
  }

  
  isFieldInvalid(field: string): boolean {
    const control = this.tourReviewForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  addTourReview(): void {
    console.log(this.tourReviewForm.value);
  
    const review: TourReview = {
      grade: this.tourReviewForm.value.grade,
      comment: this.tourReviewForm.value.comment,
      userId: this.tourReviewForm.value.userId,
      tourId: this.tourReviewForm.value.tourId,
      image: {
        data: this.tourReviewForm.value.imageData || '', 
        uploadedAt: new Date().toISOString(), 
        mimeType: this.tourReviewForm.value.mimeType || 'image/jpeg', 
      },
      reviewDate: this.tourReviewForm.value.reviewDate,
      visitDate: this.tourReviewForm.value.visitDate,
    };
  
    this.service.addReview(review).subscribe({
      next: (response) => {
        console.log('Review added successfully:', response);
      },
      error: (err) => {
        console.error('Error adding review:', err);
      },
    });
  }

}
