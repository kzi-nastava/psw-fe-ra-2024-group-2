import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CreateTourBundleComponent } from './bundles/create-tour-bundle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SuccessModalComponent } from './bundle-success-modal/success-modal.component';
import { ShowAllBundlesComponent } from './show-all-bundles/show-all-bundles.component';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    CreateTourBundleComponent,
    SuccessModalComponent,
    ShowAllBundlesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [
    ShoppingCartComponent,
    CreateTourBundleComponent,
    SuccessModalComponent,
    ShowAllBundlesComponent
  ]
})
export class MarketplaceModule { }