import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { Tour } from '../../model/tour.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { KeyPoint } from '../../model/keyPoint.model';


@Component({
  selector: 'xp-guide-tour-create',
  templateUrl: './guide-tour-create.component.html',
  styleUrls: ['./guide-tour-create.component.css']
})
export class GuideTourCreateComponent implements OnInit {

  @Input() editableTourId: number | null = null;
  @Output() closeCreateTour = new EventEmitter<void>(); // Notify parent

  tourForm!: FormGroup;
  guideId!: number;
  showMap = false;
  keyPoints: KeyPoint[] | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.guideId = this.authService.getUserId(); // Fetch logged-in user's ID

    this.createForm();
    if(this.editableTourId != null){
      this.editForm();
      console.log("edit form: " + this.editableTourId);
    } 
  }

  editForm(){
    this.tourService.getTourById(this.editableTourId).subscribe({
      next: (result: any) => {
        //console.log("response editable tour: " + result.value);
        //console.log("Tours array: ", JSON.stringify(result.value, null, 2));
        const tourData = { ...(result.value as Tour) };
        this.keyPoints = result.value.keyPoints;
        //console.log("editable tour: " + JSON.stringify(this.editableTour, null, 2));
        //console.log("editable tour name: " + result.value.name);
        //console.log("editable tour name: " + this.editableTour.name);
        //console.log("key points: " + this.keyPoints);
        //console.log("key points: ", JSON.stringify(this.keyPoints, null, 2));
        this.tourForm = this.fb.group({
          name: [tourData.name, Validators.required],
          description: [tourData.description, Validators.required],
          difficulty: [tourData.difficulty],
          category: [tourData.category],
          price: [tourData.price, [Validators.min(0)]],
          date: [this.formatDate(tourData.date)],   
          status: [tourData.status]   
        });
      },
      error: (err) => {
        console.error('Error fetching key points:', err);
        this.keyPoints = null;  // Set to null if there's an error fetching the key points
      }
    });
    //this.editableTour = this.tourService.getTourById(this.editableTourId);
    //console.log("tour name: " + this.editableTour?.name);
    

    //this.keyPoints = this.tourService.getTourKeyPoints(this.editableTour?.id);
    
  }

  createForm(){
    this.tourForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: [null],
      category: [''],
      price: [null, [Validators.min(0)]],
      date: [''],
      
    });
  }

  submitForm(): void {
    if (this.tourForm.valid) {
      const tourData: Tour = {
        ...this.tourForm.value,
        guideId: this.guideId,
        id: this.editableTourId,
        keyPoints: this.keyPoints    
      };

      this.tourService.createTour(tourData).subscribe({
        next: () => {
          if(this.editableTourId == null)
            alert('Tour created successfully!');
          else{
            alert('Tour saved successfully!');
          }
          this.closeCreateTour.emit();
        },
        error: err => console.error('Error:', err)
      });
    }
  }

  cancel(): void {
    this.closeCreateTour.emit();
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => {
        //this.initMap();
      }, 100); // Ensures the map container is visible before initializing
    }
  }

  handleLocationsSelection(newKeyPoints: KeyPoint[]) {
    console.log('Final Selected Locations:', newKeyPoints);
    this.keyPoints = newKeyPoints; // Update location list with selected locations
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; // Converts to "YYYY-MM-DD"
  }
  


}

