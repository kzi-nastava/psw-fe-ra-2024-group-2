import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { SpinWheelService } from 'src/app/shared/services/spin-wheel.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourSale } from '../../tour-authoring/model/tourSale.model';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

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
    selector: 'xp-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

    currentIndex: number = 0;
    tours: Tour[] = [];
    cardsPerView: number = 3;
    user: User;
    initialSpin: string = '';
    wheelVisible: boolean = false;
    spinResult: string = '';
    spinResultVisible: boolean = false;
    isWheelSpinned: boolean = false;
    tourSales: TourSale[] = [];

    constructor(
      private spinWheelService: SpinWheelService,
      private tourExecutionService: TourExecutionService, 
      private router: Router,
      private authService: AuthService,
      private tourService : TourAuthoringService,
      private tourAuthoringService: TourAuthoringService) {}
    
    ngOnInit(): void {
      this.authService.user$.subscribe(user => {
        this.user = user;
        console.log('Logged-in user:', user);

        if (this.user && this.user.role) {
          this.getTours();
          this.updateCardsPerView();
        }
      });
      this.authService.isRegistered$.subscribe(isRegistered => {
        if (isRegistered && this.user.role === 'tourist') {
          this.wheelVisible = true;
        }
      });
      window.addEventListener('resize', () => this.updateCardsPerView());
      this.loadTourSales();
    }
    ngOnDestroy() {
      this.authService.resetRegistrationStatus(); // Reset when leaving the component
    }

    closeSpinOverlay(): void {
      this.spinResult = '';  // Briše rezultat
      this.wheelVisible = false;
      this.spinResultVisible = false;
    }
    onSpinCompleted(result: string): void {
      //console.log('Rezultat spinovanja:', result);
      this.initialSpin = result;
      let discountPercentage = 0;
      if(this.initialSpin === '15%') discountPercentage = 15
      else if(this.initialSpin === '5%') discountPercentage = 5
      else if(this.initialSpin === '10%') discountPercentage = 10
      else if(this.initialSpin === '20%') discountPercentage = 20

      if(this.initialSpin === 'again'){
        return;
      }
      else if(this.initialSpin === 'bad luck'){
        this.spinResult = 'Unlucky, better luck next time'
      }
      else if(this.initialSpin === '5%' || this.initialSpin === '10%' || this.initialSpin === '15%' || this.initialSpin === '20%'){
        this.tourAuthoringService.createTouristBonus(this.user.id, discountPercentage).subscribe({
          next: (createdTouristBonus) => {
            console.log('Tourist bonus created:', createdTouristBonus);
            this.spinResult = 'Congratulations! You got a ' + discountPercentage + '% discount coupon!\n'
            this.spinResult += 'Your coupon code is: ' + createdTouristBonus.couponCode

            this.spinWheelService.spinCompleted.emit();
          },
          error: (err) => {
            console.error("Error creating tourist bonus:", err);
          }
        })
      }
      else{
        console.log(`GRESKA, POGRESAN KOD`)
      }
      this.spinResultVisible = true;
      this.isWheelSpinned = true;
      console.log('this.spinResultVisible: ', this.spinResultVisible);
    }

    ngAfterViewInit(): void {}
    
    getTours(): void {
      if(this.user.role.toLowerCase() === 'author'){
        this.tourAuthoringService.getTours().subscribe({
          next: (result: PagedResult<Tour>) =>{
            this.tours = result.results
          },
          error: (err:any) => {
            console.log(err)
          }
        });
      }else if(this.user.role.toLowerCase() === 'tourist'){
        this.tourExecutionService.getTours().subscribe({
          next: (result: PagedResult<Tour>) => {
              this.tours = result.results;
          },
          error: (err: any) => {
              console.log(err);
          }
        });
      } 
    }
    
    updateCardsPerView(): void {
        if (window.innerWidth < 768) {
            this.cardsPerView = 1;
        } else if (window.innerWidth < 1024) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 3;
        }
    }
    
    slideLeft(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }
    
    slideRight(): void {
        const maxIndex = Math.max(0, this.tours.length - this.cardsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        }
    }
    
    isFirstSlide(): boolean {
        return this.currentIndex === 0;
    }
    
    isLastSlide(): boolean {
        return this.currentIndex >= (this.tours.length - this.cardsPerView)/this.cardsPerView;
    }
    
    getSliderStyle(): any {
        const translatePercentage = (this.currentIndex * (100 / this.cardsPerView));
        return {
            transform: `translateX(-${translatePercentage}%)`,
            width: `${(this.tours.length / this.cardsPerView) * 100}%`
        };
    }

    showTourClick(tour: Tour): void {
      if(this.user.role.toLowerCase() === 'author'){
        this.router.navigate(['/edittours'], { queryParams: { tour: JSON.stringify(tour) } });
      }else if(this.user.role.toLowerCase() === 'tourist'){
        this.router.navigate(['/alltours']);
      }else{
        this.router.navigate(['/login']);
      }
    }

    
    getTagLabel(tag: number): string {
        return Tag[tag];
    }
    
    getDifficultyLabel(difficulty: number): string {
        return Difficulty[difficulty];
    }

      //Sale methods
  loadTourSales(): void {
    this.tourService.getAllSale().subscribe((sales) => {
      this.tourSales = sales;
      console.log(sales)
    });
  }

  isOnSale(tourId: number): boolean {
    const isOnSale = this.tourSales.some((sale) =>
      sale.tours.some((tour) =>
        tour.prices.some((price) => price.tourId === tourId)
      )
    );
    return isOnSale;
  }
  

  getSalePrice(tourId: number): number | null {
    for (const sale of this.tourSales) {
      for (const tour of sale.tours) {
        const price = tour.prices.find((p: { tourId: number; }) => p.tourId === tourId);
        if (price) {
          return price.newPrice;
        }
      }
    }
    return null;
  }
}