import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Equipment } from '../../administration/model/equipment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';

@Component({
  selector: 'xp-edittour',
  templateUrl: './edittour.component.html',
  styleUrls: ['./edittour.component.css']
})
export class EditTourComponent implements OnInit {

  tours: Tour[] = []
  tour: Tour;
  equipmentsTotal: Equipment[] = []
  selectedEquipment: Equipment[] = [];
  checkpointsIds: number[] = [];
  tourObjects: any[] = [];
  tourCheckpoints: any[] = [];
  tourCheckpointObjects: any[] = [];

  constructor(private service: TourAuthoringService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAllEquipment()
    this.loadTourObjects();

    this.route.queryParamMap.subscribe(params => {
      const tourJson = params.get('tour');
      if (tourJson) {
        this.tour = JSON.parse(tourJson);
        this.selectedEquipment = this.equipmentsTotal.filter(equip =>
          this.tour.equipment.includes(equip.id!)
        );
      }
    });
    this.tours.push(this.tour)
    this.loadTourCheckpoints()

  }

  loadTourObjects() {
    this.service.getObjects().subscribe({

      next: (result: PagedResult<Object>) => {
        this.tourObjects = result.results
      },
      error: (error) => {
        console.error('Error fetching objects from the backend:', error);
      }
    });
  }

  linkToursWithCheckpoints(): void {
    this.tourCheckpointObjects = this.tours.map(tour => {
      const checkpointsForTour = this.tourCheckpoints.filter(
        (checkpoint) => tour.checkpoints.includes(checkpoint.id)
      );
      return {
        tourId: tour.id,
        checkpoints: checkpointsForTour
      };
    });
  }

  loadTourCheckpoints(): void {

    for (let i = 0; i < this.tour.checkpoints.length; i++) {
      this.checkpointsIds.push(this.tour.checkpoints[i])
    }


    this.service.getTourCheckpoints(this.checkpointsIds).subscribe({
      next: (result: PagedResult<Checkpoint>) => {
        this.tourCheckpoints = result.results;
        this.linkToursWithCheckpoints();
      },
      error: (error) => {
        console.error('Error fetching checkpoints from the backend: ', error);
      }
    })
    console.log(this.tour)
  }

  loadAllEquipment(): void {
    this.service.getAllEquipment().subscribe({
      next: (result: PagedResult<Equipment>) => {
        this.equipmentsTotal = result.results;
        if (this.tour) {
          this.selectedEquipment = this.equipmentsTotal.filter(equip =>
            this.tour.equipment.includes(equip.id!)
          );
        }
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  isEquipmentSelected(equipmentId: number | undefined): boolean {
    return equipmentId !== undefined && this.tour?.equipment?.includes(equipmentId);
  }

  onSelectEquipment(event: any, equipment: Equipment): void {
    if (event.target.checked) {
      if (!this.selectedEquipment.find(item => item.id === equipment.id)) {
        this.selectedEquipment.push(equipment);
      }
    } else {
      this.selectedEquipment = this.selectedEquipment.filter(item => item.id !== equipment.id);
    }
  }

  updateTour(): void {

    this.tour.equipment = this.selectedEquipment
      .map(equip => equip.id)
      .filter((id): id is number => id !== undefined);


    this.service.updateTour(this.tour).subscribe({
      next: (response) => {
      },
      error: (err) => {
        console.error('Error updating tour:', err);
      }
    });
  } 
  
  publishTour() {
    console.log('Tour published');
    this.tour.status = 1;
    this.updateTour();
  }
  
  archiveTour() {
    console.log('Tour archived');
    this.tour.status = 2;
    this.updateTour();
  }

}
