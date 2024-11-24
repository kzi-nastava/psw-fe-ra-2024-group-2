// show-all-bundles.component.ts
import { Component, OnInit, ViewChild } from "@angular/core";
import { Bundle, BundleStatus, FullBundle, TourStatus } from "../model/bundle.model";
import { PaymentBundleService } from "../services/payment-bundle.service";
import { PagedResult } from "../../blog/blog.module";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCartService } from "../services/shopping-cart.service";
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";

@Component({
    selector: 'xp-show-all-bundles',
    templateUrl: './show-all-bundles.component.html',
    styleUrls: ['./show-all-bundles.component.css']
})
export class ShowAllBundlesComponent implements OnInit {
    bundles: FullBundle[] = [];
    BundleStatus = BundleStatus; // Make enum available in template

    @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

    constructor(
        private bundleService: PaymentBundleService,
        private shoppingCartService: ShoppingCartService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadBundles();
    }

    loadBundles(): void {
        this.bundleService.getBundles().subscribe({
            next: (result: PagedResult<FullBundle>) => {
                console.log('Bundles loaded', result);
                this.bundles = result.results.filter(b => b.status == BundleStatus.Published);
            },
            error: (err) => {
                console.error('Error loading bundles', err);
                this.showError('Failed to load bundles');
            }
        });
    }

    getStatusColor(status: BundleStatus | null): string {
        switch (status) {
            case BundleStatus.Published:
                return 'var(--dark-green)';
            case BundleStatus.Draft:
                return 'var(--text-light)';
            case BundleStatus.Archived:
                return 'var(--error)';
            default:
                return 'var(--text-light)';
        }
    }

    getStatusLabel(status: BundleStatus | null): string {
        switch (status) {
            case BundleStatus.Published:
                return 'Published';
            case BundleStatus.Draft:
                return 'Draft';
            case BundleStatus.Archived:
                return 'Archived';
            default:
                return 'Unknown';
        }
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

    buyBundle(bundle: FullBundle): void {
        this.shoppingCartService.buyBundle(bundle.id).subscribe({
            next: () => {
                this.showSuccess('Bundle purchased successfully');

                if (this.shoppingCart) {
                    this.shoppingCart.loadCartItems();
                }

                if (!this.shoppingCart.isOpen) {
                    this.shoppingCart.toggleCart();
                }
            },
            error: (err) => {
                console.log('Error buying bundle', err);
                this.showError(err.error?.message || 'Failed to buy bundle');
            }
        });
    }
}