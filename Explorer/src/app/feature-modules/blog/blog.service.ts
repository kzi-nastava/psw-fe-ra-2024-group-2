import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../blog/blog.module';
import { Blog } from '../blog/model/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://localhost:44333/api/user';



  getBlogs(): Observable<PagedResult<Blog>>{
    return this.http.get<PagedResult<Blog>>('https://localhost:44333/api/user/blog')
  }

  getOneBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(`https://localhost:44333/api/user/blog/${id}`);
  }
  addRatingOnBlog(blogId: number,username: string,ratingType : string): Observable<Blog> {
    return this.http.put<Blog>(`https://localhost:44333/api/user/blog/rating/${blogId}/${username}/${ratingType}`,{});
  }

  getBlogWithRatings(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blog/${id}/with-ratings`);
  }

  constructor(private http: HttpClient) { }
}
