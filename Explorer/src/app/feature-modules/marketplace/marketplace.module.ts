import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CreateTourBundleComponent } from './bundles/create-tour-bundle.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    CreateTourBundleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ShoppingCartComponent,
    CreateTourBundleComponent
  ]
})
export class MarketplaceModule { }