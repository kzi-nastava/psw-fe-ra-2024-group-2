import { Component, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from '@angular/animations';
import { Bundle, BundleStatus, FullBundle } from "../model/bundle.model";
import { PaymentBundleService } from "../services/payment-bundle.service";
import { PagedResult } from "../../blog/blog.module";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditBundleDialogComponent } from "../edit-bundle-modal/edit-bundle-dialog.component";
import { DeleteBundleDialogComponent } from "../delete-bundle-modal/delete-bundle-dialog.component";

@Component({
    selector: 'xp-my-bundles',
    templateUrl: './my-bundles.component.html',
    styleUrls: ['./my-bundles.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(-20px)', opacity: 0 }),
                animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ])
        ])
    ]
})
export class MyBundlesComponent implements OnInit {
    bundles: FullBundle[] = [];
    BundleStatus = BundleStatus;
    isLoading = false;
    currentSort: 'name' | 'price' | 'status' = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private bundleService: PaymentBundleService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadBundles();
    }

    loadBundles(): void {
        this.isLoading = true;
        this.bundleService.getMyBundles().subscribe({
            next: (result: PagedResult<FullBundle>) => {
                this.bundles = result.results;
                this.sortBundles();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading bundles', err);
                this.showError('Failed to load bundles');
                this.isLoading = false;
            }
        });
    }

    sortBundles(): void {
        this.bundles.sort((a, b) => {
            let comparison = 0;
            switch (this.currentSort) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
            }
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    toggleSort(sortKey: 'name' | 'price' | 'status'): void {
        if (this.currentSort === sortKey) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort = sortKey;
            this.sortDirection = 'asc';
        }
        this.sortBundles();
    }

    openEditDialog(bundle: Bundle): void {
        const dialogRef = this.dialog.open(EditBundleDialogComponent, {
            width: '600px',
            data: { ...bundle },
            panelClass: 'custom-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadBundles();
                this.showSuccess('Bundle updated successfully');
            }
        });
    }

    openDeleteDialog(bundle: Bundle): void {
        const dialogRef = this.dialog.open(DeleteBundleDialogComponent, {
            width: '400px',
            data: { ...bundle },
            panelClass: 'custom-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadBundles();
                this.showSuccess('Bundle deleted successfully');
            }
        });
    }

    getStatusColor(status: BundleStatus | null): string {
        switch (status) {
            case BundleStatus.Published:
                return 'var(--success)';
            case BundleStatus.Draft:
                return 'var(--warning)';
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

    getTotalTours(bundle: FullBundle): number {
        return bundle.tours?.length || 0;
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    private showError(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }
}