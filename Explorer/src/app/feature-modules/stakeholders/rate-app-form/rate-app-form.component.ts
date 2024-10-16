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

  constructor(private service: ProfileService,private administratorService: AdministrationService,private authService: AuthService, private router: Router) {
  }
  rateAppForm = new FormGroup({
    grade: new FormControl('', [Validators.required,Validators.max(5),Validators.min(1)]),
    comment: new FormControl(''),
  });
  
  ngOnInit(): void {
    this.getRatingApplication();

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  getRatingApplication(): void {
    this.administratorService.getRatingApplication().subscribe({
      next: (result: PagedResults<RatingApplication>) => {
        this.ratingApplication = result.results;
      },
      error: () => {
      }
    })
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
        next: () => {
          // Možeš dodati neku akciju po uspešnom dodavanju
        },
        error: (err) => {
          console.error('Error adding tourist rate', err);
        }
      });
    } else if (this.user.role === "author") {
      // Ako je role 1, pozovi servis za autore
      this.service.addRateAppAuthor(rate).subscribe({
        next: () => {
          // Možeš dodati neku akciju po uspešnom dodavanju
        },
        error: (err) => {
          console.error('Error adding author rate', err);
        }
      });
    }
  }
}