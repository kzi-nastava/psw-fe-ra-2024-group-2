import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { BlogComponentComponent } from './blog-component/blog-component.component';
import { CommentComponent } from './comment/comment.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
 
export interface PagedResult<T> {
  results: T[];
  totalCount: number;
}

@NgModule({
  declarations: [
    CommentComponent,
    BlogComponentComponent,
    CreateBlogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    CommentComponent
  ]
})
export class BlogModule {}
