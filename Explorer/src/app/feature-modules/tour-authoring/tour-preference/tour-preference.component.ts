// tour-preference.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'app-tour-preference',
  templateUrl: './tour-preference.component.html',
  styleUrls: ['./tour-preference.component.css']
})
export class TourPreferenceComponent implements OnInit {
  preferenceForm: FormGroup;
  
  availableTags = [
    { id: 'adventure', name: 'Adventure' },
    { id: 'relaxation', name: 'Relaxation' },
    { id: 'historical', name: 'Historical' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'nature', name: 'Nature' }
  ];

  difficultyLevels = ['Easy', 'Moderate', 'Hard'];

  constructor(
    private fb: FormBuilder,
    private tourPreferenceService: TourAuthoringService,
  ) {
    this.preferenceForm = this.fb.group({
      difficulty: ['Easy', Validators.required],
      walkRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      bicycleRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      carRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      boatRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      tags: [[]],
    });
  }

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  loadUserPreferences(): void {
    this.tourPreferenceService.getPreferences().subscribe({
      next: (preferences) => {
        if (preferences) {
          this.preferenceForm.patchValue(preferences);
        }
      },
      error: (error) => {
        console.error('Failed to load preferences:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.preferenceForm.valid) {
      this.tourPreferenceService.createPreference(this.preferenceForm.value).subscribe({
        next: () => {
          console.log('Preferences saved successfully');
        },
        error: (error) => {
          console.error('Failed to save preferences:', error);
        }
      });
    }
  }

  toggleTag(tag: string): void {
    const currentTags = this.preferenceForm.get('tags')?.value || [];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex === -1) {
      currentTags.push(tag);
    } else {
      currentTags.splice(tagIndex, 1);
    }
    
    this.preferenceForm.patchValue({ tags: currentTags });
  }

  isTagSelected(tag: string): boolean {
    return this.preferenceForm.get('tags')?.value?.includes(tag) || false;
  }
}