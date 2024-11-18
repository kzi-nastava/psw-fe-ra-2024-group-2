import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { TourIssueReport } from '../model/tour-issue-report.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnChanges {
  //@Output() reportsUpdate = new EventEmitter<null>()
  @Input() tour: Tour
  @Input() shouldEdit: boolean = false;
  @Input() userId: number | null = null; // Primamo userId
  @Input() tourId: number | null = null; // Primamo tourId

  constructor(private service: TourExecutionService, private router: Router){}
  // category: string = '';
  // description: string = '';
  // priority: string = '';
  ngOnChanges(): void {
     this.reportForm.reset();
  }

  reportForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
  });

  addTourIssueReport(): void {
    if (!this.tourId || !this.userId) {
      console.error('Tour ID or User ID is missing!');
      return;
    }

    const category = this.reportForm.value.category;
    const description = this.reportForm.value.description;
    const priority = this.reportForm.value.priority;

    console.log('Podaci izveštaja:', {
      category,
      description,
      priority,
      tourId: this.tourId,
      userId: this.userId
    });
  
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
      tourId: this.tourId,
      userId: this.userId,
    };

    // Poziv servisa za dodavanje izveštaja
    this.service.addTourIssueReport(newTourIssueReport).subscribe({
      next: () => { console.log("Uspelo")
        this.reportForm.reset();
      },
      error: (err) => {
        console.error('Error adding report:', err);
        alert('Failed to add report. Please try again.');
      }
    })
  }
}
