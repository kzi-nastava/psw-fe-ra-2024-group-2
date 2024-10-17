import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Za reactive forme
import { MaterialModule } from '../../infrastructure/material/material.module'; // Uveri se da imaš ispravan put ka MaterialModule
import { CommentComponent } from './comment/comment.component';

export interface PagedResult<T> {
  results: T[];
  totalCount: number;
}

@NgModule({
  declarations: [
    CommentComponent, // Komponente u BlogModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Dodaj ReactiveFormsModule ako koristiš reactive forms
    MaterialModule      // Dodaj MaterialModule ako koristiš Angular Material komponente
  ],
  exports: [
    CommentComponent // Eksportuješ CommentComponent ako ga koristiš van ovog modula
  ]
})
export class BlogModule {}
