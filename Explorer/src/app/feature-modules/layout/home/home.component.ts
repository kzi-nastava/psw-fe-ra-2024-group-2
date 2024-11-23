import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

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
    
    constructor(
      private tourExecutionService: TourExecutionService, 
      private router: Router,
      private authService: AuthService,
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
      window.addEventListener('resize', () => this.updateCardsPerView());
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
}