import { Component, OnInit, ViewChild } from "@angular/core";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";

import { MapComponent } from 'src/app/shared/map/map.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Tour } from "../model/tour-model";
import { LocationDto } from "../model/location.model";
import { PagedResult } from "../../blog/blog.module";

@Component({
  selector: 'xp-search-tours-component',
  templateUrl: './search-tours.component.html',
  styleUrls: ['./search-tours.component.scss'],
})
export class SearchToursComponent implements OnInit {
  locationForm: FormGroup;
  latitude: number = 0;
  longitude: number = 0;
  radius: number = 0;
  @ViewChild('map', { static: false }) mapComponent!: MapComponent;

  displayedColumns: string[] = ['name', 'description', 'difficulty', 'price', 'status'];
  tours: Tour[] = [];

  constructor(private tourService: TourAuthoringService, private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      radius: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.radius = this.locationForm.value.radius;

    let location: LocationDto = {
      latitude: this.latitude,
      longitude: this.longitude,
      radius: this.radius,
    }
    
    this.tourService.getNearbyTours(location).subscribe((tours: PagedResult<Tour>) => {
      this.tours = tours.results;
      console.log(tours);
    });
  }

  onLocationSelected(event: any) {
    this.longitude = event.lng;
    this.latitude = event.lat;
  }
}