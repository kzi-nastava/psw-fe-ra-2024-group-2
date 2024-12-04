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

  ngOnInit(): void {
    this.fetchSales();
  }

  fetchSales(): void{
    this.tourSaleService.getAll().subscribe(
      (sales: TourSale[]) => {
        console.log('TourSales:', sales);
        this.sales = sales;
      },
      (error) => {
        console.error('Error fetching TourSales:', error);
      }
    );
  }
  
  createNewSale(): void {
    this.router.navigate(['/newSale']);
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
