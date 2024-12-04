import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selectedTours: TourPayment[] = [];
  constructor(private fb: FormBuilder, private tourSaleService: SaleService) {}

  ngOnInit(): void {
    this.saleDetailsFormGroup = this.fb.group({
      name: ['', Validators.required],
      discountPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      endDate: ['', Validators.required],
    });
  
    const sale = history.state.sale as TourSale;
    if (sale) {
      this.populateForm(sale);
    }
  
    this.loadTours();
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
    const sale: TourSale = {
      id: history.state.sale?.id || 0,
      name: this.saleDetailsFormGroup.value.name,
      startDate: history.state.sale?.startDate || new Date(),
      endDate: this.saleDetailsFormGroup.value.endDate,
      discountPercentage: this.saleDetailsFormGroup.value.discountPercentage,
      userId: 0,
      tours: this.selectedTours.map((tour) => ({
        ...tour,
        prices: [
          {
            tourId: tour.id,
            oldPrice: tour.price,
            newPrice: tour.price * (1 - this.saleDetailsFormGroup.value.discountPercentage / 100),
          },
        ],
      })),
    };
  
    if (sale.id > 0) {
      this.tourSaleService.updateTourSale(sale.id, sale).subscribe((updatedSale) => {
        console.log('Sale updated:', updatedSale);
      });
    } else {
      this.tourSaleService.createTourSale(sale).subscribe((newSale) => {
        console.log('New sale created:', newSale);
      });
    }
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
