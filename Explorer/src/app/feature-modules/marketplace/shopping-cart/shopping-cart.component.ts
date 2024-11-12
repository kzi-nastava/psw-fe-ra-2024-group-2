import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  isOpen = false;
  orderItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: ShoppingCartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getOrderItems().subscribe(items => {
      this.orderItems = items;
      this.loadTotalPrice();
    });
  }

  loadTotalPrice() {
    this.cartService.getTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });
  }

  removeItem(tourId: number) {
    this.cartService.removeItem(tourId).subscribe({
      next: () => {
        this.loadCartItems();
        this.snackBar.open('Item removed from cart', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error removing item', 'Close', { duration: 3000 });
      }
    });
  }

  checkout() {
    this.cartService.checkout().subscribe({
      next: () => {
        this.orderItems = [];
        this.totalPrice = 0;
        this.snackBar.open('Checkout successful!', 'Close', { duration: 3000 });
        this.isOpen = false;
      },
      error: () => {
        this.snackBar.open('Error during checkout', 'Close', { duration: 3000 });
      }
    });
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadCartItems();
    }
  }
}