import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { Image } from 'src/app/shared/model/image.model';
import * as L from 'leaflet';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourDurationByTransportDtos } from '../model/tourDurationByTransportDtos.model';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-add-tour-checkpoints',
  templateUrl: './add-tour-checkpoints.component.html',
  styleUrls: ['./add-tour-checkpoints.component.css']
})

export class AddTourCheckpointsComponent implements OnInit {
  checkpoints: Checkpoint[] = [];
  checkpointCollection: any[] = [];

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  latitude: number = 0;
  longitude: number = 0;
  tourId: number = 0;
  tour: Tour | null = null;
  routingControl: L.Routing.Control | null = null;
  clearMarkersFlag: boolean = false;


  @ViewChild('map', { static: false }) mapComponent!: MapComponent;

  constructor(
      private service: TourAuthoringService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

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
      this.route.params.subscribe(params => {
          this.tourId = +params['id'];
      });
      const state = history.state as { tour: Tour };
        if (state?.tour) {
            this.tour = state.tour;
        } else {
            console.error('No tour data found');
        }
  }

  onFileSelect(event: any): void {
      const file = event.target.files[0];
      if (file) {
          this.selectedImage = file;

          const reader = new FileReader();
          reader.onload = () => {
              this.imagePreview = reader.result;
          };
          reader.readAsDataURL(file);
      }
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
                  latitude: Number(this.checkpointForm.value.latitude || 0),
                  longitude: Number(this.checkpointForm.value.longitude || 0),
                  image: image,
                  secret: this.checkpointForm.value.secret || ""
              };

              this.checkpoints.push(checkpoint);
              this.checkpointCollection = [...this.checkpointCollection, checkpoint];

              //this.addRouteToMap(); // Calculate and display the route

              this.resetForm();
          }
          reader.readAsDataURL(this.selectedImage);
      }
      else {
          const checkpoint: Checkpoint = {
              name: this.checkpointForm.value.name || "",
              description: this.checkpointForm.value.description || "",
              latitude: Number(this.checkpointForm.value.latitude || 0),
              longitude: Number(this.checkpointForm.value.longitude || 0),
              secret: this.checkpointForm.value.secret || ""
          };

          this.checkpoints.push(checkpoint);
          this.checkpointCollection = [...this.checkpointCollection, checkpoint];
          this.resetForm();
          this.selectedImage = null;
      }
  }

  handleCheckpointRemoved(index: number): void {
    if (index >= 0 && index < this.checkpoints.length) {
      console.log(this.checkpoints);
      this.checkpoints.splice(index, 1);
      this.checkpointCollection = [...this.checkpoints];
      console.log("------");
      console.log(this.checkpoints);
    }
  }

  addRouteToMap(): void {
    if (this.checkpoints.length < 2) return;
    // Clear existing map layers and controls
    this.mapComponent.map.eachLayer((layer: L.Layer) => {
        if (!(layer instanceof L.TileLayer)) { // Keep the base tile layer
            this.mapComponent.map.removeLayer(layer);
        }
    });

    // Remove any existing routing control
    if (this.routingControl) {
        this.mapComponent.map.removeControl(this.routingControl);
    }

    // Create an array to hold the waypoints
    const waypoints = this.checkpoints.map((checkpoint) => {
        // Create a marker for each checkpoint
        const marker = L.marker([checkpoint.latitude, checkpoint.longitude]);
        console.log("Da li udjes");
        // Bind a popup to the marker that displays the checkpoint's name
        marker.bindPopup(`<h5>${checkpoint.name}</h5>`);
        // Add the marker to the map
        marker.addTo(this.mapComponent.map);

        // Return the waypoint as LatLng for routing
        return L.latLng(checkpoint.latitude, checkpoint.longitude);
    });

        this.routingControl = L.Routing.control({
        waypoints,
        router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', { profile: 'mapbox/driving' }),
        routeWhileDragging: false,
        addWaypoints: false,
    });

    this.routingControl.addTo(this.mapComponent.map);
    // Hide the directions box
    const itineraryElement = document.querySelector('.leaflet-routing-container');
    if (itineraryElement) {
        itineraryElement.setAttribute('style', 'display: none;');
    }
}


  clearMarkers(){
    this.clearMarkersFlag = true;
  }
  onMarkersCleared(): void {
    setTimeout(() => {
      this.clearMarkersFlag = false; 
    });
  }

  onLocationSelected(location: { lat: number, lng: number }) {
      this.latitude = location.lat;
      this.longitude = location.lng;
      this.checkpointForm.get('latitude')?.setValue(this.latitude.toString());
      this.checkpointForm.get('longitude')?.setValue(this.longitude.toString());
  }

  resetForm(): void {
      this.checkpointForm.reset();
      this.selectedImage = null;
      this.imagePreview = null;
  }

  cancelTour(): void {
    this.router.navigate(['/addNewTour']);
  }

  async finalizeTour(): Promise<void> {
    if (this.checkpoints.length < 2) {
        console.log('Please add at least 2 checkpoints to create a tour');
        return;
    }

    if (!this.tour) {
        console.error('No tour data found');
        this.router.navigate(['/addNewTour']);
        return;
    }

    let durations = await this.findDuration();
    this.tour.tourDurationByTransportDtos = durations;
    
    this.service.addTourAndCheckpoints(this.tour, this.checkpoints).subscribe({
        next: (createdTour) => {
            console.log('Tour created:', createdTour);
            this.router.navigate(['/mytours']); 
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

          routingOptions.forEach(({ profile, transport }) => {
              const routingControl = L.Routing.control({
                  router: L.routing.mapbox('pk.eyJ1IjoicHN3Z3J1cGEyIiwiYSI6ImNtMmc5OWlybTAwNHEya3F4emZrMDVoZGsifQ.aD0uouzJcAGE--8As0GFjg', { profile }),
                  waypoints,
                  routeWhileDragging: false,
              });

              const promise = new Promise<TourDurationByTransportDtos>((resolveDuration, rejectDuration) => {
                  routingControl.on('routesfound', (e) => {
                      const route = e.routes[0];
                      const duration = route.summary.totalTime;
                      console.log(`Duration for ${transport}:`, duration);
                      resolveDuration({ transport, duration });
                  });

                  routingControl.on('routingerror', (error) => {
                      console.error("Error finding route:", error);
                      rejectDuration({ transport, duration: 0 });
                  });

                  routingControl.addTo(this.mapComponent.map);
              });

              durationPromises.push(promise);
          });

          Promise.all(durationPromises)
              .then((durations) => {
                  console.log("Durations found:", durations);
                  resolve(durations);
              })
              .catch((error) => {
                  console.error("Error calculating durations:", error);
                  reject([{ transport: 'Driving', duration: 0 }, { transport: 'Walking', duration: 0 }, { transport: 'Bicycling', duration: 0 }]);
              });
      });
  }
}