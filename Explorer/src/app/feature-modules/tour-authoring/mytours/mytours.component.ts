import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Checkpoint } from '../model/checkpoint.model';
import { MatDialog } from '@angular/material/dialog';
import { ObjectUpdateComponent } from '../object-update/object-update.component';
import { Coupon } from '../model/coupon.model';

export enum Status {
  Draft = 0,
  Published = 1,
  Archived = 2
}

export enum Tag {
  Adventure = 0,
  Relaxation = 1,
  Historical = 2,
  Cultural = 3,
  Nature = 4
}

export enum Difficulty {
  Easy = 0,
  Moderate = 1,
  Hard = 2
}

@Component({
  selector: 'xp-mytours',
  templateUrl: './mytours.component.html',
  styleUrls: ['./mytours.component.css']
})


export class MyToursComponent implements OnInit {

  tours: Tour[] = []
  tourObjects: any[] = [];
  tourCheckpoints: any[] = [];
  tourCheckpointObjects: any[] = [];
  coupons: Coupon[] = [];

  coupon = {
    discount: 1,
    tourId: -10,
  };
  applyToAll = false;
  successMessage: string = '';
  unsuccessMessage: string = '';
  //selectedObject: Object | null = null;

  constructor(private service: TourAuthoringService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTours();
    this.loadTourObjects();
    this.loadTourCheckpoints();
    this.loadCoupons();
  }

  loadTourObjects() {
    this.service.getObjects().subscribe({

      next: (result: PagedResult<Object>) => {
        this.tourObjects = result.results
      },
      error: (error) => {
        console.error('Error fetching objects from the backend:', error);
      }
    });
  }

  loadTourCheckpoints(): void {
    this.service.getCheckpoints().subscribe({
      next: (result: PagedResult<Checkpoint>) => {
        this.tourCheckpoints = result.results;
        this.linkToursWithCheckpoints();

      },
      error: (error) => {
        console.error('Error fetching checkpoints from the backend: ', error);
      }
    })
  }

  loadCoupons(): void {
    this.service.getCoupons().subscribe({
      next: (result: PagedResult<Coupon>) => {
        this.coupons = result.results;
      },
      error: (error) => {
        console.error('Error fetching coupons from the backend: ', error);
      }
    });
  }

  getNameOfTourForCoupon(tourId: number): string {
    if (tourId === -100) {
      return 'All tours';
    }
    const tour = this.tours.find(tour => tour.id === tourId);
    return tour ? tour.name : '';
  }

  //this will work for now, but in the future we should update checkpoint model since its -> (1,1)
  linkToursWithCheckpoints(): void {
    this.tourCheckpointObjects = this.tours.map(tour => {
      const checkpointsForTour = this.tourCheckpoints.filter(
        (checkpoint) => tour.checkpoints.includes(checkpoint.id)
      );
      return {
        tourId: tour.id,
        checkpoints: checkpointsForTour
      };
    });
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResult<Tour>) => {
        this.tours = result.results
      },
      error: (err: any) => {
        console.log(err)
      }
    });
  }

  createCoupon() {

    if (this.coupon.tourId === -10) {
      this.unsuccessMessage = 'Please select a tour!';
      setTimeout(() => {
        this.unsuccessMessage = '';
      }, 3000);
      return;
    }

    let newCoupon: Coupon = {
      code: '',
      tourId: this.coupon.tourId,
      authorId: -100,
      discountPercentage: this.coupon.discount,
      allToursDiscount: this.applyToAll
    }

    console.log(newCoupon);
    this.service.createCoupon(newCoupon).subscribe({
      next: () => {
        this.successMessage = 'Coupon created successfully!';
        this.loadCoupons();
        setTimeout(() => {
          this.successMessage = '';
          this.resetForm();
          this.loadCoupons();
        }, 3000);

      },
      error: (error) => {
        console.error('Error creating coupon:', error);
      }
    });
  }

  showTourClick(tour: Tour): void {
    this.router.navigate(['/edittours'], { queryParams: { tour: JSON.stringify(tour) } });
  }

  getStatusLabel(status: number): string {
    return Status[status];
  }

  getTagLabel(tag: number): string {
    return Tag[tag];
  }

  getDifficultyLabel(difficulty: number): string {
    return Difficulty[difficulty];
  }

  onApplyToAllChange() {
    if (this.applyToAll) {
      this.coupon.tourId = -100; // Set tourId to -100 when applying to all tours
    } else {
      this.coupon.tourId = -10; // Reset tourId when not applying to all
    }
  }
  resetForm() {
    this.coupon = { tourId: -10, discount: 1 }; // Reset form fields
    this.applyToAll = false;
  }
}
