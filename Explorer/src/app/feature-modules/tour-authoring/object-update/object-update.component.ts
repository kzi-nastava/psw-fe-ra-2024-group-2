import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Object } from '../model/object.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'xp-object-update',
  templateUrl: './object-update.component.html',
  styleUrls: ['./object-update.component.css']
})
export class ObjectUpdateComponent{
@Input() objectToUpdate!: Object; // The object to update
@Output() objectUpdated = new EventEmitter<void>();
  
  updateForm: FormGroup;
  latitude: number = 0;
  longitude: number = 0;

  constructor(private service: TourAuthoringService,private dialogRef: MatDialogRef<ObjectUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object
  ) {
    this.updateForm = new FormGroup({
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.objectToUpdate) {
      this.latitude = this.objectToUpdate.latitude;
      this.longitude = this.objectToUpdate.longitude;

      this.updateForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
    }
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.latitude = location.lat;
    this.longitude = location.lng;
    this.updateForm.get('latitude')?.setValue(this.latitude);
    this.updateForm.get('longitude')?.setValue(this.longitude);
  }

  updateObject(): void {
    const latitude = this.updateForm.value.latitude;
    const longitude = this.updateForm.value.longitude;
  
    console.log('aaaaaaaaaa')
    console.log(this.data)
    this.service.updateObject([longitude, latitude], this.data.id).subscribe({
      next: () => {
        this.objectUpdated.emit();
      },
      error: (error: any) => {
        console.error('Error updating object:', error);
      }
    });
  }
  onSubmit() : void {
   
    this.dialogRef.close()
  }
}
