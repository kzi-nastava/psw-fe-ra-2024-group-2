import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TourService } from '../../tour.service';
import { TourRate } from '../../model/tourRate.model';

@Component({
  selector: 'xp-guide-tour-rates',
  templateUrl: './guide-tour-rates.component.html',
  styleUrls: ['./guide-tour-rates.component.css']
})
export class GuideTourRatesComponent implements OnInit{
  @Input() tourId: number | null;
  @Output() close = new EventEmitter<void>();
  

  tourRates: TourRate[] | null;

  
  constructor(private tourService: TourService){
    //console.log("Guide Tour Rates Component start: tourID: " + this.tourId);
  }

  ngOnInit() {
    console.log("Guide Tour Rates Component start: tourID: " + this.tourId);
    this.getTourRates();
  }



  getTourRates(): void {
    //this.tourId = 1;
    if (this.tourId != null) {
        console.log("GetGuideTourRates");
        this.tourService.getTourRatesByGuide(this.tourId).subscribe({
            next: (response) => {
                this.tourRates = response;
                console.log("Tour rates:", this.tourRates);
            },
            error: (err) => {
                console.error("Error fetching tour rates:", err);
            }
        });
    }
  }

  closeTourRates() {
    this.close.emit(); // Emit event when the modal is closed
  }

}


