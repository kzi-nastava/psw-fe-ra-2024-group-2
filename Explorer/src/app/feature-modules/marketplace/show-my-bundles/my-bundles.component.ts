import { Component, OnInit } from "@angular/core";
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
    styleUrls: ['./my-bundles.component.css']
})
export class MyBundlesComponent implements OnInit {
    bundles: FullBundle[] = [];
    BundleStatus = BundleStatus;
    isLoading = false;

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
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading bundles', err);
                this.showError('Failed to load bundles');
                this.isLoading = false;
            }
        });
    }

    openEditDialog(bundle: Bundle): void {
        this.dialog.open(EditBundleDialogComponent, {
            width: '600px',
            data: { ...bundle }
        });
    }

    openDeleteDialog(bundle: Bundle): void {
        this.dialog.open(DeleteBundleDialogComponent, {
            width: '400px',
            data: { ...bundle }
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
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }
}