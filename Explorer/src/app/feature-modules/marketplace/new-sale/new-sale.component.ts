import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { TourPayment, TourSale } from '../model/sale.model';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'xp-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.css']
})
export class NewSaleComponent {
  saleDetailsFormGroup: FormGroup;
  tours: TourPayment[] = [];
  filteredTours: TourPayment[] = [];
  selectedTours: TourPayment[] = [];
  private readonly MAX_SALE_DURATION = 14;
  constructor(private fb: FormBuilder, private tourSaleService: SaleService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.saleDetailsFormGroup = this.fb.group({
      name: ['', Validators.required],
      discountPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
    });
  
    const sale = history.state.sale as TourSale;
    if (sale) {
      this.populateForm(sale);
    }
  
    this.loadTours();
    this.filteredTours = this.tours;
  }

  loadTours(): void {
    this.tourSaleService.getToursByUserId().subscribe(
      (pagedResult) => {
        console.log('Tours fetched from server:', pagedResult);
        this.tours = pagedResult.results.map((tour) => ({
          ...tour,
          selected: false,
        }));
      },
      (error) => {
        console.error('Error fetching tours:', error);
      }
    );
  }

  saveSale(): void {
    if (this.selectedTours.length === 0) {
      this.showNotification('Please select at least one tour', 'error');
      return;
    }
  
    const sale: TourSale = {
      id: history.state.sale?.id || 0,
      name: this.saleDetailsFormGroup.value.name,
      startDate: history.state.sale?.startDate || new Date(),
      endDate: this.saleDetailsFormGroup.value.endDate,
      discountPercentage: this.saleDetailsFormGroup.value.discountPercentage,
      userId: 0,
      tours: this.selectedTours.map(tour => ({
        ...tour,
        prices: [{
          tourId: tour.id,
          oldPrice: tour.price,
          newPrice: tour.price * (1 - this.saleDetailsFormGroup.value.discountPercentage / 100),
        }],
      })),
    };
  
    const operation$ = sale.id > 0 ? 
      this.tourSaleService.updateTourSale(sale.id, sale) :
      this.tourSaleService.createTourSale(sale);
  
    operation$.pipe(
      catchError(error => {
        const errorMessage = error?.error?.message || `Failed to ${sale.id ? 'update' : 'create'} sale`;
        this.showNotification(errorMessage, 'error');
        return EMPTY;
      })
    ).subscribe(() => {
      this.showNotification(`Sale successfully ${sale.id ? 'updated' : 'created'}!`, 'success');
      this.router.navigate(['/sale']);
    });
  }

  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
  
  validateEndDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const endDate = new Date(control.value);
    const currentDate = new Date();
    const daysDifference = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference > this.MAX_SALE_DURATION) {
      return { maxDuration: true };
    }
    
    if (endDate <= currentDate) {
      return { pastDate: true };
    }
    
    return null;
  }

  populateForm(sale: TourSale): void {
    this.saleDetailsFormGroup.patchValue({
      name: sale.name,
      discountPercentage: sale.discountPercentage,
      endDate: sale.endDate,
    });
  
    this.selectedTours = sale.tours.map((tour) => ({
      ...tour,
      selected: true,
    }));
  }

  onTourSelectionChange(tour: TourPayment): void {
    const index = this.selectedTours.findIndex((t) => t.id === tour.id);
    if (index >= 0) {
      this.selectedTours.splice(index, 1);
    } else {
      this.selectedTours.push(tour);
    }
  }

  filterTours(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTours = this.tours.filter(tour => 
      tour.name.toLowerCase().includes(searchTerm)
    );
  }
  
  isTourSelected(tour: TourPayment): boolean {
    return this.selectedTours.some((t) => t.id === tour.id);
  }

  toggleTourSelection(tour: TourPayment): void {
    const index = this.selectedTours.findIndex((t) => t.id === tour.id);
    if (index >= 0) {
      this.selectedTours.splice(index, 1);
    } else {
      this.selectedTours.push(tour);
    }
  }
}
