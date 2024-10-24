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

  equipment: Equipment[] = [];  // Sva oprema
  touristEquipment: Equipment[] = [];  // Oprema dodeljena turistu
  availableEquipment: Equipment[] = [];  // Dostupna oprema
  selectedEquipment: Equipment | null = null;
  selectedAvailableEquipment: Equipment | null = null;
  touristId: number; // ID ulogovanog korisnika, da se popuni iz logina

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.touristId = this.getTouristIdFromLogin(); // Pretpostavljamo da postoji metoda koja vraća touristId iz logina
    console.log('Tourist ID:', this.touristId); 
    this.loadTouristEquipment();  // Učitava opremu koja je dodeljena turistu
    this.loadAvailableEquipment();  // Učitava svu dostupnu opremu
  }

  getTouristIdFromLogin(): number {
    // Ovdje dodaj logiku za preuzimanje ID-a korisnika iz autentifikacije
    // Ovo je primer kako bi moglo izgledati, prilagodi ga svojoj aplikaciji
    // Na primer, ako koristiš JWT, možeš ga dekodirati da dobiješ ID
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    return user ? user.id : 5; // Ako korisnik nije pronađen, vrati 0 ili odgovarajući ID
  }

  loadTouristEquipment() {
    this.service.getTouristEquipment(this.touristId).subscribe({
      next: (result: Equipment[]) => {
        console.log('Tourist equipment:', result);  // Proverava koje podatke dobijaš
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
        console.log('Available equipment:', result);  // Proverava koje podatke dobijaš
        this.availableEquipment = result.results;
        this.filterAvailableEquipment();  // Filtrira opremu koja nije dodeljena turistu
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Filtrira dostupnu opremu koja još nije dodeljena turistu
  filterAvailableEquipment() {
    const touristEquipmentIds = this.touristEquipment.map(eq => eq.id);  // Dobijamo ID-ove opreme koju turist već ima
    this.availableEquipment = this.availableEquipment.filter(eq => !touristEquipmentIds.includes(eq.id));  // Uklanjamo opremu koja je već dodeljena turistu
  }

  // Selektovanje opreme
  selectEquipment(eq: Equipment) {
    this.selectedEquipment = eq;
  }

  selectAvailableEquipment(eq: Equipment) {
    this.selectedAvailableEquipment = eq;
  }

  // Dodavanje opreme turistu
  addEquipment() {
    if (this.selectedAvailableEquipment && this.selectedAvailableEquipment.id !== undefined) {
      this.service.addEquipmentToTourist(this.touristId, this.selectedAvailableEquipment.id).subscribe({
        next: () => {
          this.loadTouristEquipment();  // Ponovo učitava turistovu opremu
          this.loadAvailableEquipment();  // Ponovo učitava dostupnu opremu
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  // Uklanjanje opreme sa liste turiste
  removeEquipment() {
    if (this.selectedEquipment && this.selectedEquipment.id !== undefined) {
      this.service.removeEquipmentFromTourist(this.touristId, this.selectedEquipment.id).subscribe({
        next: () => {
          this.loadTouristEquipment();  // Ponovo učitava turistovu opremu
          this.loadAvailableEquipment();  // Ponovo učitava dostupnu opremu
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
}
