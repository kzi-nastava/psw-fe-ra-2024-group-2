import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TourService } from '../../tour.service';
import { TourRate } from '../../model/tourRate.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-rate-tour',
  templateUrl: './rate-tour.component.html',
  styleUrls: ['./rate-tour.component.css']
})
export class RateTourComponent {
  @Input() tourId: number | null = null;
  @Input() tourDate: Date | null = null; // Date of the tour
  @Input() tourRate!: TourRate | null;

  @Output() close = new EventEmitter<void>();

  
  rating: number = 0;
  comment: string = '';
  tourStatus: string = ''; // Status of the tour, e.g., 'Completed', 'Cancelled', etc.  
  ratingForm: FormGroup;

  constructor(private tourService: TourService, private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    // Initialize the form
    this.createRateForm();
    
  }

  createRateForm() {
    if (this.tourRate) {
      // If tourRate is available, pre-fill the form
      this.ratingForm = this.fb.group({
        rating: [this.tourRate.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: [this.tourRate.comment]
      });
      this.ratingForm.disable();
    } else {
      // If tourRate is not available, initialize with null values
      this.ratingForm = this.fb.group({
        rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['']
      });
      
      // Watch for changes in the rating field
      this.ratingForm.get('rating')?.valueChanges.subscribe((ratingValue) => {
        const commentControl = this.ratingForm.get('comment');
      
        if (ratingValue === 1 || ratingValue === 2) {
          // If the rating is 1 or 2, make the comment required
          commentControl?.setValidators([Validators.required]);
        } else {
          // If the rating is 3, 4, or 5, the comment is not required
          commentControl?.clearValidators();
        }
      
        // Update the validity of the comment field
        commentControl?.updateValueAndValidity();
      });
    }
  }
  
  // Check if the user is eligible to rate the tour
  canRate(): boolean {
    if(this.tourDate == null){
      return false;
    }
    const tourDate = this.tourDate;
    const currentDate = new Date();
    const oneMonthAfterTour = new Date(tourDate.setMonth(tourDate.getMonth() + 1));

    // User can rate only after the tour date and within 1 month after the tour
    return currentDate > tourDate && currentDate <= oneMonthAfterTour;
  }

    closeModal() {
      this.close.emit(); // Emit event when the modal is closed
    }

  submitRating(): void {
    console.log("submit rating buttons");
    console.log("tour ID: " + this.tourId);

    if (this.tourId != null && this.ratingForm.valid) {
      console.log(this.ratingForm.value);
      console.log("tour ID: " + this.tourId);
      const tourRate: TourRate = {
        tourID: this.tourId,
        rating: this.ratingForm.value.rating,
        comment: this.ratingForm.value.comment
      };
      console.log("TourRate created:", tourRate); // Logs the entire tourRate object
      console.log("tour ID: " + this.tourId); // Logs only the tourId
      console.log("rating: " + this.rating); // Logs the rating
      console.log("comment: " + this.comment); // Logs the comment

      this.tourService.submitRating(tourRate).subscribe({
        next: (response) => {
          console.log('Response received:', response);
          alert('Thank you for your rating!');
          this.close.emit();
        },
        error: (error) => {
          console.error('Error submitting rating:', error);
          this.close.emit();
        }
      });
      
    }
  }
}