import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RateApp } from '../model/rate-app.model';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { RatingApplication } from 'src/app/feature-modules/administration/model/rating-application.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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
      ratingTime: new Date(),  // Postavljanje trenutnog vremena
      userId: this.user.id  // Pretpostavljam da imaš userId iz user objekta
    };

    if (this.user.role === "tourist") {
      // Ako je role 2, pozovi servis za turiste
      this.service.addRateAppTourist(rate).subscribe({
        next: (response) => {
          // Ovde se postavlja poruka jer je odgovor uspešan
          this.result = 'Uspešno si ocenio aplikaciju!';
        },
        error: (err) => {
          this.result = 'Greška pri ocenjivanju aplikacije!';
          console.error('Greška pri ocenjivanju aplikacije za turiste!', err);
        }
      });
    } else if (this.user.role === "author") {
      // Ako je role 1, pozovi servis za autore
      this.service.addRateAppAuthor(rate).subscribe({
        next: (response) => {
          // Ovde se postavlja poruka jer je odgovor uspešan
          this.result = 'Uspešno si ocenio aplikaciju!';
        },
        error: (err) => {
          this.result = 'Greška pri ocenjivanju aplikacije!';
          console.error('Greška pri ocenjivanju aplikacije za autore!', err);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.rateAppForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


}