import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourSale } from '../model/sale.model';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'xp-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  constructor(private tourSaleService: SaleService, private router: Router) {}

  sales: TourSale[] = [];
  hoveredSale: any = null;
  isLoading: boolean = false;
  currentSort: 'name' | 'discount' | 'endDate' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.fetchSales();
  }

  fetchSales(): void{
    this.tourSaleService.getAll().subscribe(
      (sales: TourSale[]) => {
        console.log('TourSales:', sales);
        this.sales = sales;
        this.applySorting();
      },
      (error) => {
        console.error('Error fetching TourSales:', error);
      }
    );
  }
  
  createNewSale(): void {
    this.router.navigate(['/newSale']);
  }

  toggleSort(criteria: 'name' | 'discount' | 'endDate'): void {
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  applySorting(): void {
    this.sales.sort((a, b) => {
      let comparison = 0;
      
      switch (this.currentSort) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'discount':
          comparison = a.discountPercentage - b.discountPercentage;
          break;
        case 'endDate':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getSaleStatus(sale: TourSale): string {
    const now = new Date();
    const endDate = new Date(sale.endDate);
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (now > endDate) {
      return 'expired';
    } else if (daysUntilEnd <= 3) {
      return 'ending-soon';
    } else if (now >= new Date(sale.startDate)) {
      return 'active';
    } else {
      return 'upcoming';
    }
  }

  getSaleStatusLabel(sale: TourSale): string {
    const status = this.getSaleStatus(sale);
    switch (status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'ending-soon':
        return 'Ending Soon';
      case 'expired':
        return 'Expired';
      default:
        return '';
    }
  }

  editSale(sale: TourSale): void {
    this.router.navigate(['/newSale'], { state: { sale } });
  }

  deleteSale(id: number): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.tourSaleService.deleteTourSale(id).subscribe(() => {
        console.log('Sale deleted:', id);
        this.fetchSales();
      });
    }
  }
}
