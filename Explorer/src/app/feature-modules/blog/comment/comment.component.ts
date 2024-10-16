import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentService } from '../comment.service';
import { Comment } from '../model/comment.model';
import { PagedResult } from '../blog.module';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  comments: Comment[] = [];
  commentForm: FormGroup;
  shouldEdit: boolean = false;
  currentCommentId: number | null = null;  // ID komentara koji se trenutno edituje
  currentUserId: number = 1;  // Podaci o trenutno ulogovanom korisniku, hardkodovano za sada

  constructor(private fb: FormBuilder, private service: CommentService, private router: Router) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      blogId: ['', Validators.required],
      text: ['', Validators.required]
    });
    this.getComments();
  }

  getComments(): void {
    this.service.getAllComments().subscribe({
      next: (result: PagedResult<Comment>) => {
        this.comments = result.results;
      },
      error: (err: any) => {
        console.log('Error fetching comments:', err);
      }
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.commentForm.value,
        userId: this.currentUserId,  // Postavi userId
        createdAt: new Date(),  // Postavi trenutno vreme
        lastModifiedAt: new Date()  // Postavi trenutno vreme i za lastModifiedAt
      };
  
      this.service.addComment(commentData).subscribe({
        next: (response) => {
          console.log('Comment added successfully!');
          this.getComments();  // Ponovo učitaj komentare nakon dodavanja
          this.commentForm.reset();  // Resetuj formu
        },
        error: (err) => {
          console.log('Error adding comment:', err);
        }
      });
    }
  }

  updateComment(): void {
    if (this.commentForm.valid && this.currentCommentId) {
      const updatedComment = {
        ...this.commentForm.value,
        id: this.currentCommentId,
        userId: this.currentUserId  // Pretpostavimo da se update uvek radi sa trenutnim korisnikom
      };

      this.service.updateComment(updatedComment).subscribe({
        next: (response) => {
          console.log('Comment updated successfully!');
          this.getComments();  // Ponovo učitaj komentare nakon ažuriranja
          this.commentForm.reset();  // Resetuj formu
          this.shouldEdit = false;  // Vratimo se u režim dodavanja
          this.currentCommentId = null;
        },
        error: (err) => {
          console.log('Error updating comment:', err);
        }
      });
    }
  }

  onDeleteClick(comment: Comment): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.service.deleteComment(comment.id).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully!');
          this.getComments();  // Reload comments after deletion
        },
        error: (err) => {
          console.log('Error deleting comment:', err);
        }
      });
    }
  }

  onEditClick(comment: Comment): void {
    this.shouldEdit = true;  // Postavljamo da smo u režimu uređivanja
    this.currentCommentId = comment.id;  // Sačuvamo ID komentara koji se uređuje
    this.commentForm.patchValue({
      blogId: comment.blogId,
      text: comment.text
    });
  }

  cancelEdit(): void {
    this.shouldEdit = false;  // Prekinemo režim uređivanja
    this.commentForm.reset();  // Resetujemo formu
    this.currentCommentId = null;  // Očistimo ID trenutnog komentara
  }
}
