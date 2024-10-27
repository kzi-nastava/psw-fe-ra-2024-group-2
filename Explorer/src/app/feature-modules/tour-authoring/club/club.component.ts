import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResult } from '../shared/model/tour.module';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {

  clubs: Club[] = [];
  clubForm: FormGroup;
  shouldEdit: boolean = false;
  editingClubId: number | null = null;

  constructor(private fb: FormBuilder, private service: ClubService, private router: Router) {}

  ngOnInit(): void {
    this.clubForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageId: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
    this.getClubs();
  }

getClubs(): void {
  this.service.getAllClubs().subscribe({
    next: (result: PagedResult<Club>) => {
      this.clubs = result.results;
    },
    error: (err: any) => {
      console.log(err);
    }
  });
}

addClub(): void {
  if (this.clubForm.valid) {
    const clubData = {
      ...this.clubForm.value,
      ownerId: 1
    };

    this.service.addClub(clubData).subscribe({
      next: (response) => {
        console.log('Club added successfully!');
      },
      error: (err) => {
        console.log('Error adding club:', err);
      }
    });
  }
}


updateClub(): void {
  if (this.clubForm.valid && this.editingClubId !== null) {
    const clubData = {
      ...this.clubForm.value,
      id: this.editingClubId,
      ownerId: 1
    };

    this.service.updateClub(clubData).subscribe({
      next: (response) => {
        console.log('Club updated successfully!');
        this.getClubs();
        this.clubForm.reset();
        this.shouldEdit = false; 
      },
      error: (err) => {
        console.log('Error updating club:', err);
      }
    });
  }
}

  showClubClick(club: Club): void {
    this.shouldEdit = true;
    this.clubForm.patchValue({
      name: club.name,
      description: club.description
    });
  }

  editClub(club: Club): void {
    this.shouldEdit = true;
    this.editingClubId = club.id;
  
    this.clubForm.patchValue({
      name: club.name,
      description: club.description,
      imageId: club.imageId
    });
  }
}


