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
    // Proveri da li su svi dostupni equipment već dodeljeni turistu
    const allAvailableAssigned = this.availableEquipment.every(eq => 
        this.touristEquipment.some(te => te.id === eq.id)
    );

    if (allAvailableAssigned) {
        console.log('All available equipment are already assigned to the tourist. Skipping loading available equipment.');
        return; // Ne učitavaj dostupnu opremu ako su svi dodeljeni
    }

    this.service.getEquipmentForTourist().subscribe({
        next: (result: PagedResult<Equipment>) => {
            console.log('Available equipment:', result);
            this.availableEquipment = result.results;

            // Filtriraj dostupnu opremu odmah nakon učitavanja
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
          // Ukloni opremu iz availableEquipment i dodaj je u touristEquipment
          if(this.selectedAvailableEquipment!=null)
          this.touristEquipment.push(this.selectedAvailableEquipment);
          
          this.availableEquipment = this.availableEquipment.filter(eq => eq.id !== this.selectedAvailableEquipment!.id);
          this.loadAvailableEquipment();
          // Resetuj selektovanu opremu
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
    // Proveri da li je selectedEquipment definisan i ima validan ID
    if (this.selectedEquipment && this.selectedEquipment.id !== undefined) {
      this.service.removeEquipmentFromTourist(this.touristId, this.selectedEquipment.id).subscribe({
        next: () => {
          // Ukloni opremu iz touristEquipment
          this.touristEquipment = this.touristEquipment.filter(eq => eq.id !== this.selectedEquipment!.id);
          
          // Dodaj obrisanu opremu nazad u availableEquipment
          if(this.selectedEquipment)
          this.availableEquipment.push(this.selectedEquipment);
          this.loadAvailableEquipment();
          // Resetuj selektovanu opremu nakon brisanja
          this.selectedEquipment = null; 
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error('Selected equipment is not defined or has no valid ID.');
    }
  }
  
  }
  

