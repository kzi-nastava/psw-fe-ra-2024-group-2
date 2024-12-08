import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Souvenir, SouvenirStatus } from '../model/souvenir.model';
import { MatDialog } from '@angular/material/dialog';
import { SouvenirService } from '../services/souvenir.service';
import { EditSouvenirDialogComponent } from '../edit-souvenir-modal/edit-souvenir-modal.component';
import { DeleteConfirmDialogComponent } from '../delete-souvenir-modal/delete-confirm-souvenir-modal.component';

@Component({
    selector: 'xp-show-souvenirs-author',
    templateUrl: './show-my-souvenirs.author.component.html',
    styleUrls: ['./show-my-souvenirs.author.component.scss']
})
export class ShowMySouvenirsAuthorComponent implements OnInit {
    souvenirs: Souvenir[] = [];

    totalSouvenirs = 0;
    totalValue = 0;
    inStockSouvenirs = 0;

    constructor(
        private dialog: MatDialog,
        private souvenirService: SouvenirService
    ) { }

    ngOnInit(): void {
        this.loadSouvenirs();
    }

    loadSouvenirs(): void {
        this.souvenirService.showMySouvenirs().subscribe((souvenirs) => {
            this.souvenirs = souvenirs.results;
            this.calculateSouvenirStats();
        });
    }

    calculateSouvenirStats() {
        this.totalSouvenirs = this.souvenirs.length;
        this.totalValue = this.souvenirs.reduce((total, souvenir) =>
            total + souvenir.price, 0);
        this.inStockSouvenirs = this.souvenirs.reduce((total, souvenir) =>
            total + souvenir.count, 0);
    }

    getSouvenirStatusLabel(souvenirStatus: SouvenirStatus | null): string {
        switch (souvenirStatus) {
            case SouvenirStatus.Draft:
                return 'Draft';
            case SouvenirStatus.Published:
                return 'Published';
            case SouvenirStatus.Archived:
                return 'Archived';
            default:
                return 'Unknown';
        }
    }

    editSouvenir(souvenir: Souvenir) {
        const dialogRef = this.dialog.open(EditSouvenirDialogComponent, {
            width: '400px',
            data: { ...souvenir }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.souvenirService.updateSouvenir(result).subscribe(() => {
                    window.location.reload();
                });
            }
        });
    }

    deleteSouvenir(souvenir: Souvenir) {
        const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
            width: '400px',
            data: souvenir
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.souvenirService.deleteSouvenir(souvenir.id ?? 0).subscribe(() => {
                    window.location.reload();
                });
            }
        });
    }
}