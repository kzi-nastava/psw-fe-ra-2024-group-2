import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CreateTourBundleComponent } from './bundles/create-tour-bundle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SuccessModalComponent } from './bundle-success-modal/success-modal.component';
import { ShowAllBundlesComponent } from './show-all-bundles/show-all-bundles.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MyBundlesComponent } from './show-my-bundles/my-bundles.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditBundleDialogComponent } from './edit-bundle-modal/edit-bundle-dialog.component';
import { DeleteBundleDialogComponent } from './delete-bundle-modal/delete-bundle-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowWalletComponent } from './show-wallet/show-wallet.component';
import { ManageTouristFundsComponent } from './manage-tourist-funds/manage-tourist-funds.component';

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
    ManageTouristFundsComponent
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
    MatProgressSpinnerModule
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