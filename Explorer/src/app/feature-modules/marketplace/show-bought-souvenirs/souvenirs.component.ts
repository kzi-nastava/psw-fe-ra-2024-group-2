import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SouvenirService } from '../services/souvenir.service';
import { Souvenir, SouvenirStatus } from '../model/souvenir.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
    selector: 'app-souvenirs',
    templateUrl: './souvenirs.component.html',
    styleUrls: ['./souvenirs.component.css']
})
export class SouvenirsComponent implements OnInit {
    souvenirs: Souvenir[] = [];
    isLoading = true;

    constructor(private souvenirService: SouvenirService) { }

    ngOnInit(): void {
        this.loadSouvenirs();
    }

    loadSouvenirs(): void {
        this.isLoading = true;
        this.souvenirService.getBoughtSouvenirs().subscribe({
            next: (data) => {
                this.souvenirs = data.filter(d => d.souvenirStatus === SouvenirStatus.Published);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading souvenirs', error);
                this.isLoading = false;
            }
        });
    }

    getStatusLabel(status: SouvenirStatus | null): string {
        switch (status) {
            case SouvenirStatus.Draft: return 'Draft';
            case SouvenirStatus.Published: return 'Available';
            case SouvenirStatus.Archived: return 'Archived';
            default: return 'Unknown';
        }
    }
}