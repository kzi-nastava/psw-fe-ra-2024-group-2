import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Blog, Image, MimeType } from '../model/blog.model';

@Component({
  selector: 'xp-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent {
  blogForm: FormGroup;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isSubmitting = false;
  markdownContent: string = '';

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      images: [null]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.previewUrls = [];

      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.previewUrls.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  addBlog(): void {
    if (this.blogForm.valid) {
      const formValues = this.blogForm.value;

      if (this.selectedFiles.length > 0) {
        this.mapImages(this.selectedFiles).then((images) => {
          const newBlog: Blog = {
            id: 0,
            title: formValues.title,
            description: formValues.description,
            date: new Date(),
            status: 1,
            authorId: 1,
            images: images,
            ratings: []
          };

          this.blogService.createBlog(newBlog).subscribe({
            next: (response) => {
              console.log('Blog successfully created:', response)
              this.resetForm();
            },
            error: (err) => console.error('Error creating blog:', err)
          });
        });
      } else {
        console.error('No files selected');
      }
    } else {
      console.error('Form is invalid');
      this.markFormGroupTouched(this.blogForm);
    }
  }

  private mapImages(files: File[]): Promise<Image[]> {
    return new Promise((resolve) => {
      const imageArray: Image[] = [];
      let loadedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageArray.push({
              data: e.target.result as string,
              uploadedAt: new Date(),
              mimeType: this.getMimeTypeEnum(file.type)
            });
          }
          loadedCount++;
          if (loadedCount === files.length) {
            resolve(imageArray);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  private getMimeTypeEnum(mimeTypeString: string): MimeType {
    switch (mimeTypeString) {
      case 'image/jpeg':
        return MimeType.Jpeg;
      case 'image/png':
        return MimeType.Png;
      case 'image/gif':
        return MimeType.Gif;
      default:
        throw new Error('Unsupported MIME type');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.blogForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onMarkdownChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.markdownContent = input.value;
  }
  

  private resetForm() {
    this.blogForm.reset();
    this.selectedFiles = [];
    this.previewUrls = [];
  }

  removeImage(index: number) {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.previewUrls.splice(index, 1);
    }
  }
}
