import { Component, OnInit } from '@angular/core';
import { TourService } from '../../tour.service';
import { Tour } from '../../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-guide-tour',
  templateUrl: './guide-tour.component.html',
  styleUrls: ['./guide-tour.component.css']
})
export class GuideTourComponent implements OnInit {

  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  x: number;
  createTour: boolean = false;
  selectedTourId: number | null;
  filterStatus: string | null;

  ngOnInit(): void {
    this.x = 1;
    this.getGuideTours();
    this.applyFilter();   
    //this.getWallet(); 
  }

  constructor(
    private service: TourService,
    private authService: AuthService,
  ){

  }

  getGuideTours(): void {

      var guideId = this.authService.getUserId();

      this.service.getGuideTours(guideId).subscribe({
        next: (result: any) => {
          console.log("Tours result: ", result);  // This will print the full result object
          this.tours = result.value;
          //console.log("Tours array: ", JSON.stringify(result.value, null, 2));
          console.log("Tours array: ", JSON.stringify(this.tours, null, 2));
          //console.log("Tours array: ", JSON.stringify(this.tours, null, 2));
          this.applyFilter();
        },
        error: () => {  
        }
      })
  }

  getWallet(){
    this.authService.getWallet();
  }

  seeTours(): void{
    this.selectedTourId = null;
    this.getGuideTours();
    this.createTour = false;
  }

  editTour(tour: Tour): void{
    if(tour.id != undefined){
      this.selectedTourId = tour.id;
      this.createTour = true;
    }        
  }

  updateFilterStatus(newStatus: string | null){
    this.filterStatus = newStatus;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterStatus) {
      this.filteredTours = this.tours; // Show all tours if no filter is set
      console.log("no filter");
    } else {
      this.filteredTours = this.tours.filter(tour => tour.status === this.filterStatus);
    }
  }


}
