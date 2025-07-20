import { Component, OnInit } from '@angular/core';
import { Souvenir, SouvenirStatus } from '../model/souvenir.model';
import { SouvenirService } from '../services/souvenir.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourStatus } from '../model/bundle.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'xp-create-souvenir',
    templateUrl: './create-souvenirs.component.html',
    styleUrls: ['./create-souvenirs.component.css']
})
export class CreateSouvenirsComponent implements OnInit {
    souvenir: Souvenir = {
        id: null,
        name: '',
        description: '',
        price: 0,
        count: 0,
        souvenirStatus: null,
        tourId: 0,
        imageDto: {
            data: '',
            uploadedAt: '',
            mimeType: ''
        }
    };

    tours: Tour[] = [];
    selectedTourId: number | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    hasPublishedTours: boolean = false;

    constructor(
        private souvenirService: SouvenirService,
        private tourService: TourAuthoringService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        let authorId = this.authService.getCurrentUser().id;

        // Fetch tours for the current author
        this.tourService.getTours().subscribe(tours => {
            this.tours = tours.results.filter(tour => tour.userId === authorId && tour.status == TourStatus.Published);
            this.hasPublishedTours = this.tours.length > 0;
        });
    }

    navigateToAddTour(): void {
        this.router.navigate(['/addNewTour']);
    }

    onTourSelect(tourId: number): void {
        this.selectedTourId = tourId;
        this.souvenir.tourId = tourId;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.souvenir.imageDto = {
                    data: e.target.result,
                    uploadedAt: new Date().toISOString(),
                    mimeType: file.type
                };
                this.imagePreview = e.target.result;

                // Update file name display
                const fileNameElement = document.querySelector('.file-name');
                if (fileNameElement) {
                    fileNameElement.textContent = file.name;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    createSouvenir(): void {
        // Validate form and tour selection
        if (this.validateForm()) {
            this.souvenirService.createSouvenir(this.souvenir).subscribe(
                () => {
                    this.showSuccessNotification('Souvenir created successfully!');
                    this.cancelCreation();
                },
                (error) => {
                    this.showErrorNotification('Failed to create souvenir. Please try again.');
                }
            );
        }
    }

    cancelCreation(): void {
        // Reset form
        this.souvenir = {
            id: null,
            name: '',
            description: '',
            price: 0,
            count: 0,
            souvenirStatus: null,
            tourId: 0,
            imageDto: {
                data: '',
                uploadedAt: '',
                mimeType: ''
            }
        };
        this.selectedTourId = null;
        this.imagePreview = null;

        // Reset file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        // Clear file name display
        const fileNameElement = document.querySelector('.file-name');
        if (fileNameElement) {
            fileNameElement.textContent = '';
        }
    }

    validateForm(): boolean {
        return !!(
            this.souvenir.name &&
            this.souvenir.description &&
            this.souvenir.price > 0 &&
            this.souvenir.count >= 0 &&
            this.selectedTourId && 
            this.souvenir.imageDto.data
        );
    }

    private showSuccessNotification(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }

    private showErrorNotification(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
    }
}