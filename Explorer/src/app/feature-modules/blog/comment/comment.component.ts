import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentService } from '../comment.service';
import { Comment } from '../model/comment.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  comments: Comment[] = [];
  commentForm: FormGroup;
  shouldEdit: boolean = false;
  currentCommentId: number | null = null;  // ID of the comment being edited
  currentUserId: number = 1;  // Currently logged-in user ID, hardcoded for now
  blogId: string | null = null;

  constructor(private fb: FormBuilder, private service: CommentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.blogId = params.get('id');
    });

    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
    this.getComments(Number(this.blogId));
  }

  // Fetch comments for a specific blog
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
        blogId: Number(this.blogId),  // Inject blogId directly
        userId: this.currentUserId,
        createdAt: new Date(),
        lastModifiedAt: new Date()
      };
  
      this.service.addComment(Number(this.blogId), commentData).subscribe({
        next: () => {
          console.log('Comment added successfully!');
          this.getComments(Number(this.blogId));  // Reload comments after adding
          this.commentForm.reset();  // Reset form
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
        userId: this.currentUserId  // Assume update is done by the current user
      };

      this.service.updateComment(this.currentCommentId,Number(this.blogId), updatedComment).subscribe({
        next: () => {
          console.log('Comment updated successfully!');
          this.getComments(Number(this.blogId));  // Reload comments after updating
          this.commentForm.reset();  // Reset form
          this.shouldEdit = false;  // Return to add mode
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
    this.shouldEdit = true;  // Enter edit mode
    this.currentCommentId = comment.id;  // Save the ID of the comment being edited
    this.commentForm.patchValue({
      blogId: comment.blogId,
      text: comment.text
    });
  }

  cancelEdit(): void {
    this.shouldEdit = false;  // Exit edit mode
    this.commentForm.reset();  // Reset form
    this.currentCommentId = null;  // Clear the current comment ID
  }
}
