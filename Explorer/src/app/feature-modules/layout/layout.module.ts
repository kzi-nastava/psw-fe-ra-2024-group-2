import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TourAuthoringModule } from '../tour-authoring/tour-authoring.module'; 
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule,
    MarketplaceModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
