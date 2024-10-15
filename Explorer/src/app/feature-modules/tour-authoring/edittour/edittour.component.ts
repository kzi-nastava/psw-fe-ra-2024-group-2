import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../shared/model/tour.module';
import { Tour } from '../model/tour.model';
import { Equipment } from '../../administration/model/equipment.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-edittour',
  templateUrl: './edittour.component.html',
  styleUrls: ['./edittour.component.css']
})
export class EditTourComponent implements OnInit {

  tour: Tour;
  equipmentsTotal: Equipment[] = []
  selectedEquipment: Equipment[] = [];

  constructor(private service: TourAuthoringService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadAllEquipment()
    
    this.route.queryParamMap.subscribe(params => {
      const tourJson = params.get('tour');
      if (tourJson) {
        this.tour = JSON.parse(tourJson);
        this.selectedEquipment = this.equipmentsTotal.filter(equip => 
        this.tour.equipment.includes(equip.id!)
        );
      }
    });
    
  }

  loadAllEquipment(): void{
    this.service.getAllEquipment().subscribe({
      next: (result: PagedResult<Equipment>) =>{
        this.equipmentsTotal = result.results;

        if (this.tour) {
          this.selectedEquipment = this.equipmentsTotal.filter(equip => 
            this.tour.equipment.includes(equip.id!)
          );
        }
      },
      error: (err:any) => {
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
    // Update the tour object with the selected equipment IDs
    console.log('Selected Equipment:', this.selectedEquipment);
  
    // Update the tour object with the selected equipment IDs
    this.tour.equipment = this.selectedEquipment
      .map(equip => equip.id)
      .filter((id): id is number => id !== undefined); // Filter out undefined
  
    console.log('Updated Tour Equipment:', this.tour.equipment);
    console.log('update tour: ',this.tour)

    //Call the service method to update the tour
    this.service.updateTour(this.tour).subscribe({
      next: (response) => {
        console.log('Tour updated successfully:', response);
      },
      error: (err) => {
        console.error('Error updating tour:', err);
      }
    });
  }
}
