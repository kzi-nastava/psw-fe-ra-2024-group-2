import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagedResult } from '../blog.module';
import { BlogService } from '../blog.service';
import { Blog } from "../model/blog.model";

@Component({
  selector: 'xp-blog-component',
  templateUrl: './blog-component.component.html',
  styleUrls: ['./blog-component.component.css']
})
export class BlogComponentComponent implements OnInit {
  blogs: Blog[] = [];
  displayedColumns: string[] = ['title', 'description', 'date', 'status', 'authorId', 'action'];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (data: PagedResult<Blog>) => {
        this.blogs = data.results.map((item, index) => ({
          ...item,
          id: item.id
        }));
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  goToBlog(blog: Blog): void {
    this.router.navigate(['/blog', blog.id]);
  }

  createBlog(): void{
    this.router.navigate(['/create-blog']);
  }
}
