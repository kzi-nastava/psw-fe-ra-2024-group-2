import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { EditBundleDialogComponent } from './edit-bundle-modal/edit-bundle-dialog.component';
import { ManageTouristFundsComponent } from './manage-tourist-funds/manage-tourist-funds.component';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { SaleComponent } from './sale/sale.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShowAllBundlesComponent } from './show-all-bundles/show-all-bundles.component';
import { MyBundlesComponent } from './show-my-bundles/my-bundles.component';
import { ShowWalletComponent } from './show-wallet/show-wallet.component';

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
    NewSaleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
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
    DeleteBundleDialogComponent
  ]
})
export class MarketplaceModule { }