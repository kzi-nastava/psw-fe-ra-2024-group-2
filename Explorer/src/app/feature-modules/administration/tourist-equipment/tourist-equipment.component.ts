import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import { PagedResult } from '../../blog/blog.module';

@Component({
  selector: 'xp-tourist-equipment',
  templateUrl: './tourist-equipment.component.html',
  styleUrls: ['./tourist-equipment.component.css']
})
export class TouristEquipmentComponent implements OnInit {

  touristEquipment: Equipment[] = []; 
  availableEquipment: Equipment[] = []; 
  selectedEquipment: Equipment | null = null;
  selectedAvailableEquipment: Equipment | null = null;
  message: string | null = null;
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.loadTouristEquipment(); 
    this.loadAvailableEquipment();
  
    console.log("Tourist Equipment:", this.touristEquipment);
    console.log("Available Equipment:", this.availableEquipment);
  }
  

  loadTouristEquipment() {
    this.service.getTouristEquipment().subscribe({
      next: (result: Equipment[]) => {
        console.log('Tourist equipment:', result); 
        this.touristEquipment = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  loadAvailableEquipment() {
    this.service.getEquipmentForTourist().subscribe({
      next: (result: PagedResult<Equipment>) => {
        console.log('Available equipment response:', result);
        this.availableEquipment = result.results || [];
        this.filterAvailableEquipment();
        this.availableEquipment = this.availableEquipment.filter(eq => 
          !this.touristEquipment.some(te => te.id === eq.id)
        );
      },
      error: (err: any) => {
        console.log('Error loading available equipment:', err);
      }
    });
  }
  


  filterAvailableEquipment() {
    if (!this.availableEquipment || !this.touristEquipment) {
        console.warn('Nema dostupne opreme za filtriranje');
        return;
    }
    const touristEquipmentIds = this.touristEquipment.map(eq => eq.id);
    this.availableEquipment = this.availableEquipment.filter(eq => !touristEquipmentIds.includes(eq.id));
  }


  selectEquipment(eq: Equipment) {
    this.selectedEquipment = eq;
  }

  selectAvailableEquipment(eq: Equipment) {
    this.selectedAvailableEquipment = eq;
  }

  addEquipment() {
    
    if (this.selectedAvailableEquipment && this.selectedAvailableEquipment.id !== undefined) {
      const alreadyAssigned = this.touristEquipment.some(eq => eq.id === this.selectedAvailableEquipment!.id);
  
      if (alreadyAssigned) {
        this.message = 'This equipment is already added!';
        return; 
      }
  
      this.service.addEquipmentToTourist(this.selectedAvailableEquipment.id).subscribe({
        next: () => {
          if (this.selectedAvailableEquipment) { 
            this.touristEquipment.push(this.selectedAvailableEquipment);
          }
          this.availableEquipment = this.availableEquipment.filter(eq => eq.id !== this.selectedAvailableEquipment!.id);
          this.loadAvailableEquipment();
          this.selectedAvailableEquipment = null; 
          this.message = null; 
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error('Selected available equipment is not defined or has no valid ID greater than 0.');
    }
  }
  
  

  removeEquipment() {
    if (this.selectedEquipment && this.selectedEquipment.id !== undefined) {
      this.service.removeEquipmentFromTourist(this.selectedEquipment.id).subscribe({
        next: () => {
          this.touristEquipment = this.touristEquipment.filter(eq => eq.id !== this.selectedEquipment!.id);
          if (this.selectedEquipment) {
            this.availableEquipment.push(this.selectedEquipment);
          }
          this.loadAvailableEquipment();
          this.selectedEquipment = null; 
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
}
