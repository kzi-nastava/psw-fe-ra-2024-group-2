import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCartComponent } from '../../marketplace/shopping-cart/shopping-cart.component';
import { ShoppingCartService } from '../../marketplace/services/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | undefined;
  notificationsVisible: boolean = false;
  @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

  isOpen: boolean = false;
  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined;
  private cartItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.loadCartItems();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  toggleNotifications(): void {
    this.notificationsVisible = !this.notificationsVisible;
  }

  loadCartItems() {
    this.cartSubscription = this.cartService.getOrderItems().subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.length;
    });
  }

  toggleShoppingCart() {
    this.isOpen = !this.isOpen;
    if (this.shoppingCart) {
      this.shoppingCart.toggleCart();
      this.shoppingCart.loadCartItems();
    }
  }
  
  showProfile(): void {
    this.router.navigate(['/profile']);
  }

  showMyTours(): void {
    this.router.navigate(['/mytours']);
  }

  showSimulator(): void {
    this.router.navigate(['/position-simulator']);
  }

  showAllTours(): void {
    this.router.navigate(['/alltours']);
  }

  showPurchasedTours(): void {
    this.router.navigate(['/shopping-cart/purchasedTours']);
  }

  showReviews(): void {
    this.router.navigate(['/reviews']);
  }

  showAddNewTour(): void {
    this.router.navigate(['/addNewTour']);
  }

  showMyClub(): void {
    this.router.navigate(['/myclub']);
  }

  showClub(): void {
    this.router.navigate(['/club']);
  }

  showObjects(): void {
    this.router.navigate(['/objects']);
  }

  showObjectsForUpdate(): void {
    this.router.navigate(['/objectsTable']);
  }

  showBlogs(): void {
    this.router.navigate(['/blog']);
  }

  showComment(): void {
    this.router.navigate(['/comment']);
  }
}