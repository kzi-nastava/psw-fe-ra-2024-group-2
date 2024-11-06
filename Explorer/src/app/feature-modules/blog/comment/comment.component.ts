import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { CommentService } from '../comment.service';
import { Blog } from '../model/blog.model';
import { Comment } from '../model/comment.model';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  comments: Comment[] = [];
  commentForm: FormGroup;
  shouldEdit: boolean = false;
  currentCommentId: number | null = null;
  currentUserId: number = 1;
  blogId: string | null = null;
  blog: Blog | null = null;

  statusMap: { [key: number]: string } = {
    0: 'Draft',
    1: 'Published',
    2: 'Active',
    3: 'Famous',
    4: 'Closed'
  };

  constructor(private fb: FormBuilder, 
              private service: CommentService,
              private router: Router, 
              private route: ActivatedRoute,
              private blogService: BlogService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.blogId = params.get('id');
    });

    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
    this.getComments(Number(this.blogId));

    this.fetchBlog(Number(this.blogId));
  }

  showStatus(status: number): string {
    return this.statusMap[status] || 'Unknown Status';
  }

  fetchBlog(id: number): void {
    this.blogService.getOneBlog(id).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
      },
      error: (err) => {
        console.error('Error fetching blog:', err);
      }
    });
  }

  getComments(blogId: number): void {
    this.service.getCommentsByBlogId(blogId).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
      },
      error: (err: any) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.commentForm.value,
        blogId: Number(this.blogId),
        userId: this.currentUserId,
        createdAt: new Date(),
        lastModifiedAt: new Date()
      };
  
      this.service.addComment(Number(this.blogId), commentData).subscribe({
        next: () => {
          console.log('Comment added successfully!');
          this.getComments(Number(this.blogId));
          this.commentForm.reset();
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
    }
  }
  

  updateComment(): void {
    if (this.commentForm.valid && this.currentCommentId !== null) {
      const updatedComment = {
        ...this.commentForm.value,
        id: this.currentCommentId,
        userId: this.currentUserId
      };

      this.service.updateComment(this.currentCommentId,Number(this.blogId), updatedComment).subscribe({
        next: () => {
          console.log('Comment updated successfully!');
          this.getComments(Number(this.blogId));
          this.commentForm.reset();
          this.shouldEdit = false;
          this.currentCommentId = null;
        },
        error: (err) => {
          console.error('Error updating comment:', err);
        }
      });
    }
  }

  onDeleteClick(comment: Comment): void {
    if (comment.userId !== this.currentUserId) {
      alert('You are not authorized to delete this comment.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this comment?')) {
      this.service.deleteComment(comment.id, Number(this.blogId)).subscribe({
        next: () => {
          console.log('Comment deleted successfully!');
          this.getComments(Number(this.blogId));
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
        }
      });
    }
  }
  

  onEditClick(comment: Comment): void { 
    this.shouldEdit = true;
    this.currentCommentId = comment.id;
    this.commentForm.patchValue({
      blogId: comment.blogId,
      text: comment.text
    });
  }

  cancelEdit(): void {
    this.shouldEdit = false;
    this.commentForm.reset();
    this.currentCommentId = null;
  }
}
