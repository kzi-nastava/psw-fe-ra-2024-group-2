import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './model/comment.model';
import { PagedResult } from './blog.module';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:44333/api/blog';

  constructor(private http: HttpClient) { }

  // Fetch comments by blog ID
  getCommentsByBlogId(blogId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`https://localhost:44333/api/blog/${blogId}`);
  }

  // Add a new comment to a specific blog
  addComment(blogId: number, comment: Comment): Observable<Comment> {
    comment.blogId = blogId;
    console.log(blogId);
    return this.http.post<Comment>(`${this.apiUrl}/${blogId}`, comment);
  }

  // Update an existing comment by ID
  updateComment(commentId: number, blogId: number, comment: Comment): Observable<Comment> {
    console.log(blogId)
    return this.http.put<Comment>(`${this.apiUrl}/${blogId}/${commentId}`, comment);
  }

  // Delete a comment by ID
  deleteComment(commentId: number, blogId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${blogId}/${commentId}`);
  }
}
