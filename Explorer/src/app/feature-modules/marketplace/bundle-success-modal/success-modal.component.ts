import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bundle } from 'src/app/feature-modules/marketplace/model/bundle.model';

@Component({
    selector: 'xp-success-modal',
    templateUrl: './success-modal.component.html',
    styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { bundle: Bundle },
        private dialogRef: MatDialogRef<SuccessModalComponent>
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}