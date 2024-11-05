import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../blog/blog.module';
import { Blog } from '../blog/model/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  getBlogs(): Observable<PagedResult<Blog>>{
    return this.http.get<PagedResult<Blog>>('https://localhost:44333/api/user/blog')
  }

  getOneBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(`https://localhost:44333/api/user/blog/${id}`);
  }

  createBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>('https://localhost:44333/api/user/blog', blog);
  }
  
  constructor(private http: HttpClient) { }
}
