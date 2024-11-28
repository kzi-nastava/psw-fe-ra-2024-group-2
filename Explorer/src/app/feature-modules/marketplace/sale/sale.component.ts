import { Component, OnInit } from '@angular/core';
import { TourSale } from '../model/sale.model';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'xp-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  constructor(private tourSaleService: SaleService) {}

  sales: TourSale[] = [];

  ngOnInit(): void {
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
}
