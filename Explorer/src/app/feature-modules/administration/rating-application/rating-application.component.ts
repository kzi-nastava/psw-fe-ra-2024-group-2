import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../administration.service';
import { RatingWithUser } from '../model/rating-application.model';
import { Account } from '../../administration/model/account.model';
@Component({
  selector: 'xp-rating-application',
  templateUrl: './rating-application.component.html',
  styleUrls: ['./rating-application.component.css']
})
export class RatingApplicationComponent implements OnInit {
 totalRatings = 0;
  averageRating = 0;
  ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
displayAverageRating: number = 0;
displayTotalRatings: number = 0;
displayRatingCounts: Record<number, number> = {5:0,4:0,3:0,2:0,1:0};

  ratingWithUser: RatingWithUser[] = [];
  accounts: Account[] = [];
  filteredRatings: any[] = [];
  showDropdown = false;
  showRatingDropdown = false;
  selectedTimeRange: string = 'all';
  selectedMinRating: number = 0;
  constructor( private service: AdministrationService) { }

  ngOnInit(): void {
    this.loadData();
  }
ngOnChanges(changes: SimpleChanges): void {
    if (changes['ratingWithUser']) {
      this.calculateStatistics();
    }
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  toggleRatingDropdown() {
  this.showRatingDropdown = !this.showRatingDropdown;
}
  loadData(): void {
    this.service.getAccount().subscribe({
      next: (accountResult) => {
        this.accounts = accountResult.results;

        this.service.getRatingApplication().subscribe({
          next: (ratingResult) => {
            this.ratingWithUser = ratingResult.results.map(ratingItem => {
              const user = this.accounts.find(acc => acc.userId === ratingItem.ratingApplication.userId);
              return {
                ratingApplication: ratingItem.ratingApplication,
                username: user ? user.username : 'Nepoznat korisnik'
              } as RatingWithUser;
            });
            this.filteredRatings = this.ratingWithUser; 
            this.calculateStatistics(); 
            this.applyCombinedFilters();
             this.animateCount(Math.round(this.averageRating * 10), 2000, (val) => {
            this.displayAverageRating = val / 10;
          });

          // Animiraj total
          this.animateCount(this.totalRatings, 2000, (val) => {
            this.displayTotalRatings = val;
          });

          // Animiraj svaki rating count
          [5,4,3,2,1].forEach(rating => {
            this.animateCount(this.ratingCounts[rating], 2000, (val) => {
              this.displayRatingCounts[rating] = val;
            });
          });
           },
          error: (err) => {
            console.error('Greška pri učitavanju ocena:', err);
          }
        });
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika:', err);
      }
    });
  }

 
filterByTime(range: string) {
  this.selectedTimeRange = range;
  this.applyCombinedFilters();
  this.showDropdown = false;
}

filterByRating(minRating: number) {
  this.selectedMinRating = minRating;
  this.applyCombinedFilters();
  this.showRatingDropdown = false;
}

applyCombinedFilters() {
  const now = new Date();

  this.filteredRatings = this.ratingWithUser.filter(ra => {
    const ratingTime = new Date(ra.ratingApplication.ratingTime);
    const grade = ra.ratingApplication.grade;

    // Filter po vremenu
    let timeMatch = true;
    switch (this.selectedTimeRange) {
      case 'today':
        timeMatch = ratingTime.toDateString() === now.toDateString();
        break;
      case '7days':
        timeMatch = (now.getTime() - ratingTime.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        timeMatch = (now.getTime() - ratingTime.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        break;
      case 'year':
        timeMatch = (now.getTime() - ratingTime.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        break;
      case 'all':
      default:
        timeMatch = true;
    }

    // Filter po oceni
const ratingMatch = this.selectedMinRating === 0 || grade === this.selectedMinRating;

    return timeMatch && ratingMatch;
  });
}

  private calculateStatistics(): void {
    this.totalRatings = this.ratingWithUser.length;
    
    if (this.totalRatings === 0) {
      this.averageRating = 0;
      this.ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      return;
    }

    // Računa prosečnu ocenu
    const sum = this.ratingWithUser.reduce((acc, item) => {
      return acc + item.ratingApplication.grade;
    }, 0);
    this.averageRating = sum / this.totalRatings;

    // Broji ocene po nivoima (1-5 zvezda)
    this.ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.ratingWithUser.forEach(item => {
      const grade = item.ratingApplication.grade;
      if (grade >= 1 && grade <= 5) {
        this.ratingCounts[Math.floor(grade)]++;
      }
    });
  }

  getPercentage(count: number): number {
    return this.totalRatings > 0 ? (count / this.totalRatings) * 100 : 0;
  }

getStarsArray(rating: number): { symbol: string; class: string }[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Puna zvezda
        stars.push({ symbol: '★', class: 'star-filled' });
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Pola zvezde (prikazujemo kao punu žutu)
        stars.push({ symbol: '★', class: 'star-half' });
      } else {
        // Prazna zvezda
        stars.push({ symbol: '☆', class: 'star-empty' });
      }
    }

    return stars;
  }
 getTotalRatingsText(): string {
    if (this.totalRatings === 0) {
      return 'Nema ocena';
    } else if (this.totalRatings === 1) {
      return '1 ocena';
    } else if (this.totalRatings < 5) {
      return `${this.totalRatings} ocene`;
    } else {
      return `${this.totalRatings} ocena`;
    }
  }
  getProgressBarClass(starLevel: number): string {
    switch (starLevel) {
      case 5: return 'progress-bar-5';
      case 4: return 'progress-bar-4';
      case 3: return 'progress-bar-3';
      case 2: return 'progress-bar-2';
      case 1: return 'progress-bar-1';
      default: return 'progress-bar-default';
    }
  }
  hasRatings(): boolean {
    return this.totalRatings > 0;
  }
  getPercentageFormatted(count: number): string {
    const percentage = this.getPercentage(count);
    return percentage.toFixed(1) + '%';
  }


  animateCount(target: number, duration = 2000, callback: (value: number) => void) {
  const start = 0;
  const range = target - start;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    let progress = elapsed / duration;
    if (progress > 1) progress = 1;
    const value = Math.floor(start + range * progress);
    callback(value);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

}
