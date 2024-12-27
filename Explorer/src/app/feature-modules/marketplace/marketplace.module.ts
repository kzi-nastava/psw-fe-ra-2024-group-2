import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SuccessModalComponent } from './bundle-success-modal/success-modal.component';
import { CreateTourBundleComponent } from './bundles/create-tour-bundle.component';
import { DeleteBundleDialogComponent } from './delete-bundle-modal/delete-bundle-dialog.component';
import { DeleteConfirmDialogComponent } from './delete-souvenir-modal/delete-confirm-souvenir-modal.component';
import { EditBundleDialogComponent } from './edit-bundle-modal/edit-bundle-dialog.component';
import { EditSouvenirDialogComponent } from './edit-souvenir-modal/edit-souvenir-modal.component';
import { ManageTouristFundsComponent } from './manage-tourist-funds/manage-tourist-funds.component';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { SaleComponent } from './sale/sale.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShowAllBundlesComponent } from './show-all-bundles/show-all-bundles.component';
import { SouvenirListComponent } from './show-all-souvenirs/souvenir-list.component';
import { SouvenirsComponent } from './show-bought-souvenirs/souvenirs.component';
import { MyBundlesComponent } from './show-my-bundles/my-bundles.component';
import { ShowMySouvenirsAuthorComponent } from './show-my-souvenirs-author/show-my-souvenirs.author.component';
import { ShowWalletComponent } from './show-wallet/show-wallet.component';
import { CreateSouvenirsComponent } from './souvenirs/create-souvenirs.component';

export interface PagedResult<T> {
  results: T[];
  totalCount: number;
}

@NgModule({
  declarations: [
    ShoppingCartComponent,
    CreateTourBundleComponent,
    SuccessModalComponent,
    ShowAllBundlesComponent,
    MyBundlesComponent,
    EditBundleDialogComponent,
    DeleteBundleDialogComponent,
    ShowWalletComponent,
    ManageTouristFundsComponent,
    SaleComponent,
    NewSaleComponent,
    CreateSouvenirsComponent,
    ShowMySouvenirsAuthorComponent,
    EditSouvenirDialogComponent,
    DeleteConfirmDialogComponent,
    SouvenirListComponent,
    SouvenirsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    ShoppingCartComponent,
    CreateTourBundleComponent,
    SuccessModalComponent,
    ShowAllBundlesComponent,
    MyBundlesComponent,
    EditBundleDialogComponent,
    DeleteBundleDialogComponent,
    CreateSouvenirsComponent,
    ShowMySouvenirsAuthorComponent,
  ]
})
export class MarketplaceModule { }