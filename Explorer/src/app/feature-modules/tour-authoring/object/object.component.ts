import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { PagedResult } from '../shared/model/tour.module';
import { Object, ObjectCategory } from '../model/object.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

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
  }  
