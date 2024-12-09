import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Souvenir, SouvenirStatus } from '../model/souvenir.model';
import { SouvenirService } from '../services/souvenir.service';
import { PagedResult } from '../marketplace.module';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatDialog } from '@angular/material/dialog';
import { concatMap } from 'rxjs';

@Component({
    selector: 'app-souvenir-list',
    templateUrl: './souvenir-list.component.html',
    styleUrls: ['./souvenir-list.component.scss']
})
export class SouvenirListComponent implements OnInit {
    souvenirs: Souvenir[] = [];
    filteredSouvenirs: Souvenir[] = [];
    searchTerm: string = '';

    @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

    constructor(
        private souvenirService: SouvenirService,
        private cartService: ShoppingCartService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.loadSouvenirs();
    }

    private showError(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    loadSouvenirs(): void {
        // Fetch souvenirs from service, filtering out archived items
        this.souvenirService.showAllSouvenirs().subscribe(
            (data: PagedResult<Souvenir>) => {
                this.souvenirs = data.results.filter(s => s.souvenirStatus !== SouvenirStatus.Archived);
                this.filteredSouvenirs = [...this.souvenirs];
            },
            error => {
                this.snackBar.open('Failed to load souvenirs', 'Close', { duration: 3000 });
            }
        );
    }

    filterSouvenirs(): void {
        this.filteredSouvenirs = this.souvenirs.filter(souvenir =>
            souvenir.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    addToCart(souvenir: Souvenir): void {
        // Check if the souvenir is out of stock before adding to cart
        if (this.isOutOfStock(souvenir)) {
            this.showError('This souvenir is out of stock');
            return;
        }

        this.souvenirService.getBoughtSouvenirs().pipe(
            concatMap(boughtSouvenirs => {
                const isBought = boughtSouvenirs.some(boughtSouvenir => boughtSouvenir.id === souvenir.id);
                if (isBought) {
                    throw new Error('You have already bought this souvenir.');
                }
                return this.cartService.isSouvenirInCart(souvenir.id ?? 0);
            }),
            concatMap(isInCart => {
                if (isInCart) {
                    throw new Error('This souvenir is already in your cart');
                }
                return this.cartService.buySouvenir(souvenir.id ?? 0);
            })
        ).subscribe({
            next: () => {
                this.showSuccess('Souvenir purchased successfully');

                // Reload and toggle shopping cart if necessary
                if (this.shoppingCart) {
                    this.shoppingCart.loadCartItems();
                }

                if (!this.shoppingCart.isOpen) {
                    this.shoppingCart.toggleCart();
                }
            },
            error: (err: Error) => {
                // Display appropriate error message
                this.showError(err.message);
            }
        });
    }

    getSouvenirImage(souvenir: Souvenir): string {
        return souvenir.imageDto?.data;
    }

    isOutOfStock(souvenir: Souvenir): boolean {
        return souvenir.count <= 0;
    }
}