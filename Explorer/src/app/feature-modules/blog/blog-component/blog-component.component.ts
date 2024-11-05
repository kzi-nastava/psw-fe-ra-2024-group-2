import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResult } from '../blog.module';
import { BlogService } from '../blog.service';
import { Blog, Rating } from "../model/blog.model";

@Component({
  selector: 'xp-blog-component',
  templateUrl: './blog-component.component.html',
  styleUrls: ['./blog-component.component.css']
})
export class BlogComponentComponent implements OnInit {
  blogs: Blog[] = [];
  displayedColumns: string[] = ['title', 'description', 'date', 'status', 'authorId', 'action'];
  user: User = {} as User;
  rating : Rating = {} as Rating;
  constructor(private blogService: BlogService,private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    this.fetchBlogs();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (data: PagedResult<Blog>) => {
        this.blogs = data.results.map((blog) => ({
          ...blog,
        userVote: this.getUserVote(blog.ratings) as "Upvote" | "Downvote" | null // Dodali smo castovanje u odgovarajući tip
        }));
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }
  getUserVote(ratings: Rating[]): string | null {
    const userRating = ratings.find(rating => rating.username === this.user.username);
    return userRating ? userRating.ratingType : null;
  }

  goToBlog(blog: Blog): void {
    this.router.navigate(['/blog', blog.id]);
  }

  upvote(blog: Blog): void {
    const ratingType = "Upvote";
    this.blogService.addRatingOnBlog(blog.id, this.user.username, ratingType).subscribe(
      (updatedBlog) => {
        this.fetchBlogs();
        console.log("Rating updated successfully", updatedBlog);
      },
      (error) => {
        console.error("Error updating rating:", error);
      }
    );
  }
  
  downvote(blog: Blog): void {
    const ratingType = "Downvote";
    this.blogService.addRatingOnBlog(blog.id, this.user.username, ratingType).subscribe(
      (updatedBlog) => {
        this.fetchBlogs();
        console.log("Rating updated successfully", updatedBlog);
      },
      (error) => {
        console.error("Error updating rating:", error);
      }
    );
  }
  createBlog(): void{
    this.router.navigate(['/create-blog']);
  }
}