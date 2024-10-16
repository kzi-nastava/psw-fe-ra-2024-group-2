import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './model/comment.model';  // Corrected path based on your folder structure
import { PagedResult } from './blog.module';  // Adjusted path for PagedResult, assuming it's in the same model folder


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:44333/api/blog/comment/';  // Adjust this URL as needed

  constructor(private http: HttpClient) { }

  // Fetch all comments
  getAllComments(): Observable<PagedResult<Comment>> {
    return this.http.get<PagedResult<Comment>>('https://localhost:44333/api/blog/comment/')
  }

  // Add a new comment
  addComment(result: Comment): Observable<any> {
    return this.http.post('https://localhost:44333/api/blog/comment/', result);
  }

  // Update an existing comment
  updateComment(result: Comment): Observable<any> {
    return this.http.put(`https://localhost:44333/api/blog/comment/${result.id}`, result);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`https://localhost:44333/api/blog/comment/${commentId}`);
  }
}
