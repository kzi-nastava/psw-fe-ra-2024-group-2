import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CartItem {
  id: number;
  name: string;
  price: number;
  bundleId?: number;
  tourId?: number;
}

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  isOpen = false;
  orderItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: ShoppingCartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  get bundleItems(): CartItem[] {
    return this.orderItems.filter(item => item.bundleId);
  }

  get tourItems(): CartItem[] {
    return this.orderItems.filter(item => item.tourId);
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

  removeItem(item: CartItem) {
    this.cartService.removeItem(item).subscribe({
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
        this.snackBar.open('Checkout successful! New tour(s) added to your collection.', 'Close', { duration: 4000 });
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

  getItemsTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}