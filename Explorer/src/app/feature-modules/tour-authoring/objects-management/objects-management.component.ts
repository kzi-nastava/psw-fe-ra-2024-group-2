import { Component } from '@angular/core';
import { Object } from '../model/object.model';
import { ObjectUpdateComponent } from '../object-update/object-update.component';
import { MatDialog } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../../blog/blog.module';

@Component({
  selector: 'xp-objects-management',
  templateUrl: './objects-management.component.html',
  styleUrls: ['./objects-management.component.css']
})
export class ObjectsManagementComponent {

  objects: Object[] = []

  constructor(private service: TourAuthoringService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getObjects();
  }
  
  getObjects(): void {
    this.service.getObjects().subscribe({
      next: (result: PagedResult<Object>) =>{
        this.objects = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });
  }

  editObject(objek: Object) {
    const dialogRef = this.dialog.open(ObjectUpdateComponent, {
      width: '400px',
      data: objek 
    });
  }
}
