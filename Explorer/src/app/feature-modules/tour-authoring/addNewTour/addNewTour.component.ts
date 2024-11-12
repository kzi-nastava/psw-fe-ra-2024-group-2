import { AfterViewInit, Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { EventEmitter } from '@angular/core';
import { Checkpoint } from '../model/checkpoint.model';
import { TourDurationByTransportDtos } from '../model/tourDurationByTransportDtos.model';
import { PagedResult } from '../shared/model/tour.module';
import { Image } from 'src/app/shared/model/image.model';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
    selector: 'xp-addnewtour',
    templateUrl: './addNewTour.component.html',
    styleUrls: ['./addNewTour.component.css']
})

export class AddNewTourComponent implements OnInit {
    checkpoints: Checkpoint[] = [];
    selectedImage: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    latitude: number = 0;
    longitude: number = 0;
    tempImage: Image | null = null;

    @ViewChild('map', { static: false }) mapComponent!: MapComponent;

    constructor(private service: TourAuthoringService) { }

    tourForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(0),
        tag: new FormControl(0),
        difficulty: new FormControl(0),
        price: new FormControl(0, [Validators.required])
    });

    checkpointForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        latitude: new FormControl('', [Validators.required]),
        longitude: new FormControl('', [Validators.required]),
        image: new FormControl(''),
        tour: new FormControl(null),
        secret: new FormControl('', [Validators.required])
    });

    ngOnInit(): void {

    }

    onFileSelect(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedImage = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result; // Preview the image
            };
            reader.readAsDataURL(file); // Convert the file to base64 format
        }
    }

    async addTour(): Promise<void> {

        if (this.checkpoints.length < 2) {
            console.log('Please add at least 2 checkpoints to create a tour');
            return;
        }

        let tour: Tour = {
            userId: 1,
            equipment: [],
            id: 0, // This will be updated after the tour is created
            name: this.tourForm.value.name || "",
            description: this.tourForm.value.description || "",
            status: Number(this.tourForm.value.status) || 0,
            tag: Number(this.tourForm.value.tag) || 0,
            difficulty: Number(this.tourForm.value.difficulty) || 0,
            price: Number(this.tourForm.value.price) || 0,
            checkpoints: [], // Checkpoints will be updated separately
            tourDurationByTransportDtos: []
        };

        const transportModes: Array<'Walking' | 'Bicycling' | 'Driving'> = ['Walking', 'Bicycling', 'Driving'];

        transportModes.forEach((mode) => {
            const duration: TourDurationByTransportDtos = {
                transport: mode,
                duration: 0,
            };
            tour.tourDurationByTransportDtos.push(duration);
        });

        let durations = await this.findDuration();

        tour.tourDurationByTransportDtos = durations;

        this.service.addTourAndCheckpoints(tour, this.checkpoints).subscribe({
            next: (createdTour) => {
                console.log('Tour created:', createdTour);
                window.location.reload();
            },
            error: (err) => {
                console.error("Error creating tour:", err);
            }
        });
    }

    findDuration(): Promise<TourDurationByTransportDtos[]> {
        return new Promise<TourDurationByTransportDtos[]>((resolve, reject) => {
            if (this.checkpoints.length < 2) {
                console.error("At least two checkpoints are required to calculate duration.");
                resolve([{ transport: 'Driving', duration: 0 }, { transport: 'Walking', duration: 0 }, { transport: 'Bicycling', duration: 0 }]);
                return;
            }

            const waypoints = this.checkpoints.map((checkpoint) =>
                L.latLng(checkpoint.latitude, checkpoint.longitude)
            );

            // Create an array to hold promises for each routing request
            const durationPromises: Promise<TourDurationByTransportDtos>[] = [];

            const routingOptions = [
                {
                    profile: 'mapbox/driving',
                    transport: 'Driving',
                },
                {
                    profile: 'mapbox/walking',
                    transport: 'Walking',
                },
                {
                    profile: 'mapbox/cycling',
                    transport: 'Bicycling',
                },
            ];

            // Iterate over the routing options to create routing requests
            routingOptions.forEach(({ profile, transport }) => {
                const routingControl = L.Routing.control({
                    router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', { profile }),
                    waypoints,
                    routeWhileDragging: false,
                });

                const promise = new Promise<TourDurationByTransportDtos>((resolveDuration, rejectDuration) => {
                    routingControl.on('routesfound', (e) => {
                        const route = e.routes[0];
                        const duration = route.summary.totalTime; // Duration in seconds
                        console.log(`Duration for ${transport}:`, duration);
                        resolveDuration({ transport, duration });
                    });

                    routingControl.on('routingerror', (error) => {
                        console.error("Error finding route:", error);
                        rejectDuration({ transport, duration: 0 }); // Return duration 0 on error
                    });

                    routingControl.addTo(this.mapComponent.map);
                });

                durationPromises.push(promise);
            });

            // Wait for all duration promises to resolve
            Promise.all(durationPromises)
                .then((durations) => {
                    console.log("Durations found:", durations);
                    resolve(durations);
                })
                .catch((error) => {
                    console.error("Error calculating durations:", error);
                    reject(0);
                });
        });
    }


    addCheckpoint(): void {
        if (this.selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                const image: Image = {
                    data: base64String.split(',')[1],
                    mimeType: this.selectedImage!.type,
                    uploadedAt: new Date().toISOString()
                };

                const checkpoint: Checkpoint = {
                    name: this.checkpointForm.value.name || "",
                    description: this.checkpointForm.value.description || "",
                    latitude: Number(this.checkpointForm.value.latitude || 0), // Add latitude from form
                    longitude: Number(this.checkpointForm.value.longitude || 0),
                    image: image,
                    secret: this.checkpointForm.value.secret || ""
                };

                this.checkpoints.push(checkpoint);
                this.resetForm();

            }
            reader.readAsDataURL(this.selectedImage);
        }
        else {
            const checkpoint: Checkpoint = {
                name: this.checkpointForm.value.name || "",
                description: this.checkpointForm.value.description || "",
                latitude: Number(this.checkpointForm.value.latitude || 0), // Add latitude from form
                longitude: Number(this.checkpointForm.value.longitude || 0),
                secret: this.checkpointForm.value.secret || ""
            };

            this.checkpoints.push(checkpoint);
            this.checkpointForm.reset();
            this.selectedImage = null;
        }
    }



    onLocationSelected(location: { lat: number, lng: number }) {
        this.latitude = location.lat;
        this.longitude = location.lng;

        // Optionally, update the form controls directly
        this.checkpointForm.get('latitude')?.setValue(this.latitude.toString());
        this.checkpointForm.get('longitude')?.setValue(this.longitude.toString());
    }

    resetForm(): void {
        this.checkpointForm.reset(); // Reset all form fields to initial state
        this.selectedImage = null; // Clear the selected image
        this.imagePreview = null; // Clear the image preview
    }

}