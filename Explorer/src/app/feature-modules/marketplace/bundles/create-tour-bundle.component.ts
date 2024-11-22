import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';

@Component({
    selector: 'xp-create-tour-bundle',
    templateUrl: './create-tour-bundle.component.html',
    styleUrls: ['./create-tour-bundle.component.css']
})
export class CreateTourBundleComponent implements OnInit {
    public tourBundleForm: FormGroup;
    tours: Tour[] = [];
    selectedTours: Tour[] = [];

    constructor(
        private fb: FormBuilder,
        private tourService: TourAuthoringService
    ) {
        this.tourBundleForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            price: ['', [Validators.required, Validators.min(0)]],
            tours: [this.selectedTours, [this.minimumSelectedToursValidator(2)]]
        });
    }

    ngOnInit(): void {
        this.loadTours();
    }

    loadTours(): void {
        this.tourService.getTours().subscribe({
            next: (result: PagedResult<Tour>) => {
                console.log('Tours loaded', result);
                this.tours = result.results;
            },
            error: (err) => {
                console.error('Error loading tours', err);
            }
        });
    }

    toggleTourSelection(tour: Tour): void {
        if (this.isTourSelected(tour)) {
            this.selectedTours = this.selectedTours.filter(t => t.id !== tour.id);
        } else {
            this.selectedTours.push(tour);
        }
        this.updateToursControl();
    }

    isTourSelected(tour: Tour): boolean {
        return this.selectedTours.some(t => t.id === tour.id);
    }

    getDifficultyLabel(difficulty: number): string {
        switch (difficulty) {
            case 0:
                return 'Easy';
            case 1:
                return 'Moderate';
            case 2:
                return 'Difficult';
            default:
                return 'Unknown';
        }
    }

    getStatusLabel(status: number): string {
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

    createTourBundle(): void {
        if (this.tourBundleForm.valid && this.selectedTours.length >= 3) {
            const bundleData = {
                ...this.tourBundleForm.value,
                tours: this.selectedTours.map(tour => tour.id)
            };

            // Implement tour bundle creation service method
            //   this.tourService.createTourBundle(bundleData).subscribe({
            //     next: (response) => {
            //       console.log('Tour bundle created', response);
            //       // Reset form and selections
            //       this.tourBundleForm.reset();
            //       this.selectedTours = [];
            //     },
            //     error: (err) => {
            //       console.error('Error creating tour bundle', err);
            //     }
            //   });
        }
    }

    private updateToursControl(): void {
        this.tourBundleForm.get('tours')?.setValue(this.selectedTours);
        this.tourBundleForm.get('tours')?.updateValueAndValidity();
    }

    private minimumSelectedToursValidator(min: number) {
        return (control: AbstractControl) => {
            const value = control.value as Tour[];
            return value.length >= min ? null : { minimumSelectedTours: { required: min, actual: value.length } };
        };
    }
}
