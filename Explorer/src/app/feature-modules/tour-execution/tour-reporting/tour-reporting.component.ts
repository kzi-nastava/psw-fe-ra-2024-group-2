import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourIssueReport } from '../model/tour-issue-report.model';


@Component({
  selector: 'xp-tour-reporting',
  templateUrl: './tour-reporting.component.html',
  styleUrls: ['./tour-reporting.component.css']
})
export class TourReportingComponent implements OnInit {

  tour: Tour[] =[]
  selectedTour: Tour
  tourName: string
  shouldRenderReportForm: boolean = false;
  selectedTourId!: number;
  selectedUserId!: number;
  user: any;
  isReportModalOpen: boolean = false;
  isError: boolean = false;

  constructor(private service: TourExecutionService, private authService: AuthService){}
  isTooltipVisible: boolean = false;
  tooltipText: string = '';
  tooltipPosition = { top: '0px', left: '0px' };

  showFullDescription(description: string, event: MouseEvent): void {
    this.tooltipText = description;
    this.isTooltipVisible = true;
    
    // Pozicija tooltip-a bazirana na kliknutom elementu
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tooltipPosition = {
      top: `${rect.top + window.scrollY + rect.height}px`, // Ispod elementa
      left: `${rect.left + window.scrollX}px`
    };
  }

  hideFullDescription(): void {
    this.isTooltipVisible = false;
  }
  ngOnInit():void{
    this.service.getTours().subscribe({
      next:(result: PagedResult<Tour>)=>{
        this.tour = result.results;
      },
      error: (err: any) => console.error('Failed to load tours', err)
    }),
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnChanges(): void {
    this.reportForm.reset();
  }
  reportForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
  });

  onAddClicked(tour: Tour): void {
    this.shouldRenderReportForm = true;
    this.selectedTour = tour
    this.selectedTourId = tour.id
    this.selectedUserId = this.user.id
    this.tourName = tour.name
  }
  getDifficulty(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Moderate';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
  getTag(tag: number): string {
    switch (tag) {
      case 0:
        return 'Adventure';
      case 1:
        return 'Relaxation';
      case 2:
        return 'Historical';
      case 2:
        return 'Cultural';
      case 2:
        return 'Nature';
      default:
        return 'Unknown';
    }
  }
  getStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }
  openReportModal(tour: Tour): void {
    this.isError = false;
    this.selectedTour = tour;
    this.selectedTourId = tour.id;
    this.selectedUserId = this.user.id;
    this.isReportModalOpen = true;
    this.tourName = tour.name
    this.reportForm.reset(); // Reset the form when opening
  }

  closeReportModal(): void {
      this.isReportModalOpen = false;
  }

  addTourIssueReport(): void {
    if (!this.selectedTourId || !this.selectedUserId) {
      console.error('Tour ID or User ID is missing!');
      return;
    }

    const category = this.reportForm.value.category;
    const description = this.reportForm.value.description;
    const priority = this.reportForm.value.priority;

    
    // Check if any field is empty or missing
    if (!category || !description || !priority) {
      alert('All fields are required! Please fill out category, description, and priority.');
      return;
    }

    const newTourIssueReport: TourIssueReport = {
      id: 0,
      category: this.reportForm.value.category || "",
      description: this.reportForm.value.description || "",
      priority: this.reportForm.value.priority || "",
      createdAt: new Date().toISOString(), 
      fixUntil: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      status: 0,
      tourId: this.selectedTourId,
      userId: this.selectedUserId,
    };

    // Poziv servisa za dodavanje izveštaja
    this.service.addTourIssueReport(newTourIssueReport).subscribe({
      next: () => { console.log("Uspelo")
        this.reportForm.reset();
        this.isReportModalOpen = false;
        this.isError = false;
      },
      error: (err) => {
        this.reportForm.reset();
        this.isError = true;
      }
    })
  }
}
