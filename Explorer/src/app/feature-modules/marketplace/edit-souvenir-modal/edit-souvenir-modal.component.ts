import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SouvenirStatus } from '../model/souvenir.model';

@Component({
  selector: 'app-edit-souvenir-modal',
  templateUrl: './edit-souvenir-modal.component.html',
  styleUrls: ['./edit-souvenir-modal.component.scss']
})
export class EditSouvenirDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditSouvenirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onPublish(): void {
    this.dialogRef.close({ ...this.data, souvenirStatus: SouvenirStatus.Published });
  }
}
