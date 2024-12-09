import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Coupon } from '../../tour-authoring/model/coupon.model';

interface CartItem {
  id: number;
  name: string;
  price: number;
  bundleId?: number;
  souvenirId?: number;
  tourId?: number;
  authorId: number;
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
  couponCode: string = '';
  couponError: string = '';
  finalCoupon: string = 'empty';

  constructor(
    private cartService: ShoppingCartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCartItems();
  }

  get bundleItems(): CartItem[] {
    return this.orderItems.filter(item => item.bundleId);
  }

  get tourItems(): CartItem[] {
    return this.orderItems.filter(item => item.tourId);
  }

  get souvenirItems(): CartItem[] {
    return this.orderItems.filter(item => item.souvenirId);
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
    this.cartService.checkout(this.finalCoupon).subscribe({
      next: () => {
        this.orderItems = [];
        this.totalPrice = 0;
        console.log(this.finalCoupon);
        this.snackBar.open('Checkout successful! New item(s) added to your collection.', 'Close', { duration: 4000 });
        this.isOpen = false;
        this.finalCoupon = 'empty';
        this.couponCode = '';
        this.couponError = '';
      },
      error: () => {
        this.snackBar.open('Error during checkout, Insufficient funds.', 'Close', { duration: 3000 });
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

  applyCoupon() {

    this.couponError = '';

    this.cartService.applyCoupon(this.couponCode).subscribe({
      next: (result: Coupon) => {
        const coupon: Coupon = result;

        if (coupon.allToursDiscount === true) {
          //find one that costs the most and apply discount to it
          const matchingItemsByAuthorId: CartItem[] = this.orderItems.filter(item => item.authorId === coupon.authorId);
          if (matchingItemsByAuthorId.length === 0) {
            this.couponError = 'Coupon is not valid for any items in your cart.';
            return;
          }
          const maxPriceItem = matchingItemsByAuthorId.reduce((prev, current) => (prev.price > current.price) ? prev : current);
          maxPriceItem.price = maxPriceItem.price - (maxPriceItem.price * coupon.discountPercentage / 100);
          this.finalCoupon = coupon.code;
          this.couponError = 'Coupon applied successfully.';
        }
        else {
          const matchingItemsByTourId: CartItem[] = this.orderItems.filter(item => item.tourId === coupon.tourId);
          if (matchingItemsByTourId.length === 0) {
            this.couponError = 'Coupon is not valid for any items in your cart.';
            return;
          }
          matchingItemsByTourId.forEach(item => {
            item.price = item.price - (item.price * coupon.discountPercentage / 100);
          });
          this.finalCoupon = coupon.code;
          this.couponError = 'Coupon applied successfully.';
        }
      },
      error: (error) => {
        console.error('Error fetching coupons from the backend: ', error);

        if (error.status === 404) {
          this.couponError = 'Coupon is invalid.';
        }
      }
    });
  }
}