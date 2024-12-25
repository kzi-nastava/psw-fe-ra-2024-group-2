import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RatingApplication } from 'src/app/feature-modules/administration/model/rating-application.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { RateApp } from '../model/rate-app.model';
import { ProfileService } from '../profile.service';

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

  constructor(private service: ProfileService, private authService: AuthService, private router: Router) {
  }
  rateAppForm = new FormGroup({
    grade: new FormControl('', [Validators.required, Validators.max(5), Validators.min(1)]),
    comment: new FormControl(''),
  });

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }


  addRateApp(): void {
    if (!this.user) {
      return;
    }


    const rate: RateApp = {
      grade: Number(this.rateAppForm.value.grade),
      comment: this.rateAppForm.value.comment || "",
      ratingTime: new Date(),
      userId: this.user.id
    };

    if (this.user.role === "tourist") {
      // Ako je role 2, pozovi servis za turiste
      this.service.addRateAppTourist(rate).subscribe({
        next: (response) => {
          // Ovde se postavlja poruka jer je odgovor uspešan
          this.result = 'Uspešno si ocenio aplikaciju!';
        },
        error: (err) => {
          this.result = 'There was an error, please try again!';
          console.error('Greška pri ocenjivanju aplikacije za turiste!', err);
        }
      });
    } else if (this.user.role === "author") {
      // Ako je role 1, pozovi servis za autore
      this.service.addRateAppAuthor(rate).subscribe({
        next: (response) => {
          // Ovde se postavlja poruka jer je odgovor uspešan
          this.result = 'Application rated succesfully!';
        },
        error: (err) => {
          this.result = 'There was an error, please try again!';
          console.error('There was an error for authors, please try again!', err);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.rateAppForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


}