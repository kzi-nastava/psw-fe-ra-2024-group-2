import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../blog/blog.module';
import { Blog, BlogWithUser } from '../blog/model/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://localhost:44333/api/user';



  getBlogs(): Observable<PagedResult<BlogWithUser>>{
    return this.http.get<PagedResult<BlogWithUser>>('https://localhost:44333/api/user/blog')
  }

  getOneBlog(id: number): Observable<BlogWithUser> {
    return this.http.get<BlogWithUser>(`https://localhost:44333/api/user/blog/${id}`);
  }
  addRatingOnBlog(blogId: number,username: string,ratingType : string): Observable<Blog> {
    return this.http.put<Blog>(`https://localhost:44333/api/user/blog/rating/${blogId}/${username}/${ratingType}`,{});
  }

  getBlogWithRatings(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blog/${id}/with-ratings`);
  }


  createBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>('https://localhost:44333/api/user/blog', blog);
  }
  
  constructor(private http: HttpClient) { }
}
