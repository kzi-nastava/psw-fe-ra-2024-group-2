import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';

@Component({
    selector: 'xp-addnewtour',
    templateUrl: './addNewTour.component.html',
    styleUrls: ['./addNewTour.component.css']
})
export class AddNewTourComponent implements OnInit {
    // UKLONJENO: sve vezano za checkpoints jer je prebačeno u novu komponentu
    constructor(
        private service: TourAuthoringService,
        private router: Router
    ) { }

    tourForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(0),
        tag: new FormControl(0),
        difficulty: new FormControl(0),
        price: new FormControl(0, [Validators.required])
    });
    isHelpModalOpen = false;

    toggleHelpModal() {
        this.isHelpModalOpen = !this.isHelpModalOpen;
    }

    ngOnInit(): void { }

    addTour(): void {
        let tour: Tour = {
            userId: 1,
            equipment: [],
            id: 0,
            name: this.tourForm.value.name || "",
            description: this.tourForm.value.description || "",
            status: Number(this.tourForm.value.status) || 0,
            tag: Number(this.tourForm.value.tag) || 0,
            difficulty: Number(this.tourForm.value.difficulty) || 0,
            price: Number(this.tourForm.value.price) || 0,
            checkpoints: [],
            tourDurationByTransportDtos: []
        };

        // Umesto addTour koristimo addTourAndCheckpoints sa praznim nizom checkpoints
        /*this.service.addTourAndCheckpoints(tour, []).subscribe({
            next: (createdTour) => {
                console.log('Tour created:', createdTour);
                this.router.navigate(['/tour', createdTour.id, 'checkpoints']);
            },
            error: (err) => {
                console.error("Error creating tour:", err);
            }
        });*/
        // Prosleđujemo tour objekat kroz state
        this.router.navigate(['/tour', tour.id, 'checkpoints'], {
            state: { tour: tour }
        });
    }
}