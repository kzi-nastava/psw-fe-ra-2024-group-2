import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bundle, BundleStatus, FullBundle, TourStatus } from '../model/bundle.model';
import { PaymentBundleService } from '../services/payment-bundle.service';

@Component({
    selector: 'app-edit-bundle-dialog',
    templateUrl: './edit-bundle-dialog.component.html',
    styleUrls: ['./edit-bundle-dialog.component.scss']
})
export class EditBundleDialogComponent implements OnInit {
    bundleForm: FormGroup;
    statusOptions: string[] = ['Draft', 'Published', 'Archived'];
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditBundleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: FullBundle,
        private paymentBundleService: PaymentBundleService
    ) {
        console.log(data.status)
        this.bundleForm = this.fb.group({
            name: [{ value: data.name, disabled: true }],
            price: [data.price || '', [Validators.required, Validators.min(0)]],
            status: [this.getStatusString(data.status), [Validators.required]]
        });

        console.log(data);
    }

    ngOnInit(): void { }

    onSubmit(): void {
        // TODO: Submit form
        if (this.bundleForm.valid) {
            this.isSubmitting = true;
            const formValue = this.bundleForm.getRawValue();
            this.dialogRef.close(formValue);
        }

        const bundle: Bundle = {
            name: this.data.name,
            price: this.bundleForm.value.price,
            status: this.getFromStatusString(this.bundleForm.value.status),
            authorId: this.data.authorId,
            tours: this.data.tours
        }

        // TODO: Update bundle
        this.paymentBundleService.updateBundle(this.data.id, bundle).subscribe(() => {
            this.dialogRef.close();
            // Refresh the page
            window.location.reload();
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onPublish(): void {
        // TODO: Publish form
        if (this.bundleForm.valid) {
            this.bundleForm.patchValue({ status: 'Published' });
            const formValue = this.bundleForm.getRawValue();
            this.dialogRef.close(formValue);
        }

        // TODO: Publish bundle
        this.paymentBundleService.publishBundle(this.data.id).subscribe(() => {
            this.dialogRef.close();
            // Refresh the page
            window.location.reload();
        });
    }

    isPublishable(): boolean {
        return this.bundleForm.valid && this.bundleForm.value.status !== 'Published' && this.data.tours.filter(tour => tour.tourStatus == TourStatus.Published).length >= 2;
    }

    getErrorMessage(fieldName: string): string {
        const control = this.bundleForm.get(fieldName);
        if (control?.hasError('required')) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        if (control?.hasError('min')) {
            return 'Value must be greater than 0';
        }
        return '';
    }

    getStatusString(status: any): string {
        return this.statusOptions[status];
    }

    getFromStatusString(status: string): number {
        return this.statusOptions.indexOf(status);
    }
}

