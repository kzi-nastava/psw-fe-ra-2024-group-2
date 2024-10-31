import { Component, OnInit } from '@angular/core';
import { TourReview } from '../model/tour-review.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit{
   
  reviews: TourReview[] = []
  tourId!: number;  
  editReviewForm: FormGroup;
  constructor(private service: TourExecutionService,private route: ActivatedRoute, private fb: FormBuilder)
  {
    this.editReviewForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {

    // Fetch tourId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.tourId = Number(params.get('tourId'));
      
      if (this.tourId) {
        this.service.getReviews(this.tourId).subscribe({
          next: (result: PagedResult<TourReview>) => {
            this.reviews = result.results;
          },
          error: (err) => {
            console.error('Error fetching reviews:', err);
          }
        });
      }
    });
  }

  toggleEdit(review: any) {
    review.isEditing = true;
    this.editReviewForm.patchValue({
      grade: review.grade,
      comment: review.comment
    });
  }

  cancelEdit(review: any) {
    review.isEditing = false;
    this.editReviewForm.reset();
  }

  onEditSubmit(review: any) {
    if (this.editReviewForm.valid) {
      const updatedReview = {
        ...review,
        ...this.editReviewForm.value
      };
      // Call your update service here
      // After successful update:
      this.service.updateReview(updatedReview).subscribe({
        next: (response) => {
          console.log('Review updated successfully:', response);
          this.loadReviews();
              },
        error: (err) => {
          console.error('Error adding review:', err);
        },
      });
      review.isEditing = false;
      this.editReviewForm.reset();
    }
  }
  private loadReviews() {
    if (this.tourId) {
      this.service.getReviews(this.tourId).subscribe({
        next: (result: PagedResult<TourReview>) => {
          this.reviews = result.results;
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
        }
      });
    }}
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

}
