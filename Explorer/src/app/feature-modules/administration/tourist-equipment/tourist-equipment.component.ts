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

  equipment: Equipment[] = [];  
  touristEquipment: Equipment[] = []; 
  availableEquipment: Equipment[] = []; 
  selectedEquipment: Equipment | null = null;
  selectedAvailableEquipment: Equipment | null = null;
  touristId: number;
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.touristId = this.getTouristIdFromLogin(); 
    console.log('Tourist ID:', this.touristId); 
    this.loadTouristEquipment(); 
    this.loadAvailableEquipment();  
  }
//ovo izmeni
  getTouristIdFromLogin(): number {
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    return user ? user.id : 5; 
  }

  loadTouristEquipment() {
    this.service.getTouristEquipment(this.touristId).subscribe({
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
            console.log('Available equipment:', result);
            this.availableEquipment = result.results;
            this.filterAvailableEquipment();
        },
        error: (err: any) => {
            console.log(err);
        }
    });
}

filterAvailableEquipment() {
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
      this.service.addEquipmentToTourist(this.touristId, this.selectedAvailableEquipment.id).subscribe({
        next: () => {
        
          if(this.selectedAvailableEquipment!=null)
          this.touristEquipment.push(this.selectedAvailableEquipment);
          
          this.availableEquipment = this.availableEquipment.filter(eq => eq.id !== this.selectedAvailableEquipment!.id);
          this.loadAvailableEquipment();
          this.selectedAvailableEquipment = null; 
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error('Selected available equipment is not defined or has no valid ID.');
    }
  }
  

  
  removeEquipment() {
   
    if (this.selectedEquipment && this.selectedEquipment.id !== undefined) {
      this.service.removeEquipmentFromTourist(this.touristId, this.selectedEquipment.id).subscribe({
        next: () => {
          this.touristEquipment = this.touristEquipment.filter(eq => eq.id !== this.selectedEquipment!.id);
          if(this.selectedEquipment)
          this.availableEquipment.push(this.selectedEquipment);
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
