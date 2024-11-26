import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bundle, FullBundle } from '../model/bundle.model';
import { PaymentBundleService } from '../services/payment-bundle.service';
@Component({
    selector: 'xp-delete-bundle-dialog',
    templateUrl: './delete-bundle-dialog.component.html',
})
export class DeleteBundleDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteBundleDialogComponent>,
        private paymentBundleService: PaymentBundleService,
        @Inject(MAT_DIALOG_DATA) public data: FullBundle
    ) { }

    onConfirm(): void {
        this.paymentBundleService.deleteBundle(this.data.id).subscribe(
            () => {
                this.dialogRef.close(true);
                window.location.reload();
            }
        )
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}