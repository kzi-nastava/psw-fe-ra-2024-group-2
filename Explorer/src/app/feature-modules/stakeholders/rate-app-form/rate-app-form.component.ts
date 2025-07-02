
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RatingApplication } from 'src/app/feature-modules/administration/model/rating-application.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { RateApp } from '../model/rate-app.model';
import { ProfileService } from '../profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-rate-app-form',
  templateUrl: './rate-app-form.component.html',
  styleUrls: ['./rate-app-form.component.css']
})
export class RateAppFormComponent implements OnInit {
  @Input() rateApp: RateApp;
  user: User | undefined;
  ratingApplication: RatingApplication[] = [];
  result: string = '';
  alreadyRate: string = '';
  showHelp = false;

  // Star rating properties
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  hoverRating: number = 0;
  
  // Rating text labels
  ratingLabels: { [key: number]: string } = {
  1: 'Very bad',
  2: 'Bad',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
  };

  constructor(
    private service: ProfileService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  rateAppForm = new FormGroup({
    grade: new FormControl('', [Validators.required, Validators.max(5), Validators.min(1)]),
    comment: new FormControl(''),
  });

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Star rating methods
  setRating(rating: number): void {
    this.selectedRating = rating;
    this.rateAppForm.patchValue({ grade: rating.toString() });
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  getRatingText(): string {
    const rating = this.hoverRating || this.selectedRating;
    return rating > 0 ? this.ratingLabels[rating] : '';
  }

  onStarKeydown(event: KeyboardEvent, rating: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setRating(rating);
    }
  }

  addRateApp(): void {
    if (!this.user) {
      return;
    }

    const rate: RateApp = {
      grade: this.selectedRating,
      comment: this.rateAppForm.value.comment || "",
      ratingTime: new Date(),
      userId: this.user.id
    };



if (this.user.role === "tourist") {
  this.service.addRateAppTourist(rate).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'You have successfully rated the app. We appreciate your feedback!',
        confirmButtonColor: '#8B7355'  // svetlo braon nijansa
      });
      this.resetForm();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'You have already rated this app. Please try again later.',
        confirmButtonColor: '#a94442'
      });
      console.error('Greška pri ocenjivanju aplikacije za turiste!', err);
    }
  });
} else if (this.user.role === "author") {
  this.service.addRateAppAuthor(rate).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'You have successfully rated the app. We appreciate your feedback!',
        confirmButtonColor: '#8B7355'
      });
      this.resetForm();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'You have already rated this app. Please try again later.',
        confirmButtonColor: '#a94442'
      });
      console.error('Greška pri ocenjivanju aplikacije za autore!', err);
    }
  });
}

  }

  resetForm(): void {
    this.selectedRating = 0;
    this.hoverRating = 0;
    this.rateAppForm.reset();
  }

 isFieldInvalid(fieldName: string): boolean {
    const field = this.rateAppForm.get(fieldName);
    if (fieldName === 'grade') {
      return this.selectedRating === 0 && (!!field?.touched || !!field?.dirty);
    }
    return field ? field.invalid && (!!field.dirty || !!field.touched) : false;
  }
  toggleHelp() {
  this.showHelp = !this.showHelp;
  }

}