import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Blog, Image, MimeType } from '../model/blog.model';

@Component({
  selector: 'xp-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef;
  
  blogForm: FormGroup;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isSubmitting = false;
  markdownContent: string = '';
  boldActive = false;
  italicActive = false;
  headingActive = false;
  fontSizeActive = false;
  leftActive = false;
  centerActive = false;
  rightActive = false;

  private startPos: number = 0;
  private endPos: number = 0;

  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;


  toolbarGroups = {
    text: [
      { action: 'bold', icon: 'B', label: 'Bold' },
      { action: 'italic', icon: 'I', label: 'Italic' },
      { action: 'heading', icon: 'H', label: 'Heading' },
      { action: 'fontsize', icon: 'T', label: 'Font Size' }
    ],
    alignment: [
      { action: 'left', icon: '←', label: 'Left' },
      { action: 'center', icon: '↔', label: 'Center' },
      { action: 'right', icon: '→', label: 'Right' }
    ],
    lists: [
      { action: 'unordered-list', icon: '•', label: 'Bullet List' },
      { action: 'ordered-list', icon: '1.', label: 'Numbered List' }
    ],
    media: [
      { action: 'image', icon: '🖼', label: 'Image' },
      { action: 'link', icon: '🔗', label: 'Link' }
    ]
  };
editorOptions: any;

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      images: [null]
    });
  }

  formatText(action: string): void {
    const textarea = this.descriptionTextarea.nativeElement;
    const control = this.blogForm.get('description');
    if (!control) return;

    const currentValue = control.value || '';
    const before = currentValue.substring(0, this.startPos);
    let selected = currentValue.substring(this.startPos, this.endPos);
    const after = currentValue.substring(this.endPos);

    let formattedText = '';
    switch (action) {
      case 'bold':
        if (selected && selected.trim().length > 0) {
          formattedText = `**${selected}**`;
        } else {
          if (!this.boldActive) {
            formattedText = `**`;
            this.boldActive = true;
          } else {
            formattedText = `**`;
            this.boldActive = false;
          }
        }
        break;

      case 'italic':
        if (selected && selected.trim().length > 0) {
          formattedText = `*${selected}*`;
        } else {
          if (!this.italicActive) {
            formattedText = `*`;
            this.italicActive = true;
          } else {
            formattedText = `*`;
            this.italicActive = false;
          }
        }
        break;

      case 'heading':
        if (selected && selected.trim().length > 0) {
          formattedText = `\n# ${selected}`;
        } else {
          if (!this.headingActive) {
            formattedText = `\n# `;
            this.headingActive = true;
          } else {
            formattedText = `\n`;
            this.headingActive = false;
          }
        }
        break;

      case 'fontsize':
        if (selected && selected.trim().length > 0) {
          formattedText = `<span style="font-size:20px;">${selected}</span>`;
        } else {
          if (!this.fontSizeActive) {
            formattedText = `<span style="font-size:20px;">`;
            this.fontSizeActive = true;
          } else {
            formattedText = `</span>`;
            this.fontSizeActive = false;
          }
        }
        break;

      case 'left':
        if (selected && selected.trim().length > 0) {
          formattedText = `<div align="left">${selected}</div>`;
        } else {
          if (!this.leftActive) {
            formattedText = `<div align="left">`;
            this.leftActive = true;
          } else {
            formattedText = `</div>`;
            this.leftActive = false;
          }
        }
        break;

      case 'center':
        if (selected && selected.trim().length > 0) {
          formattedText = `<div align="center">${selected}</div>`;
        } else {
          if (!this.centerActive) {
            formattedText = `<div align="center">`;
            this.centerActive = true;
          } else {
            formattedText = `</div>`;
            this.centerActive = false;
          }
        }
        break;

      case 'right':
        if (selected && selected.trim().length > 0) {
          formattedText = `<div align="right">${selected}</div>`;
        } else {
          if (!this.rightActive) {
            formattedText = `<div align="right">`;
            this.rightActive = true;
          } else {
            formattedText = `</div>`;
            this.rightActive = false;
          }
        }
        break;
      case 'unordered-list':
        formattedText = selected.split('\n').map((line: string) => `- ${line}`).join('\n');
        break;
      case 'ordered-list':
        formattedText = selected.split('\n').map((line: string, i: number) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'image':
        this.fileInput.nativeElement.click();
        return;
      case 'link':
        formattedText = `[${selected}](url)`;
        break;
    }

    const newValue = before + formattedText + after;
    control.setValue(newValue);
    
    textarea.focus();
    const newCursorPos = before.length + formattedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  }

  onCoverImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.coverImageFile = file;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.coverImagePreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
  }
  

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const control = this.blogForm.get('description');
          if (!control) return;

          const currentValue = control.value || '';
          const imageMarkdown = `![${file.name}](${e.target.result})`;
          
          const insertPosition = this.startPos || currentValue.length;
          const newValue = currentValue.slice(0, insertPosition) + 
                          '\n' + imageMarkdown + '\n' + 
                          currentValue.slice(insertPosition);
          
          control.setValue(newValue);
        }
      };
      
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  addBlog(): void {
    if (this.blogForm.valid) {
      const formValues = this.blogForm.value;
  
      const newBlog: Blog = {
        id: 0,
        title: formValues.title,
        description: formValues.description,
        date: new Date(),
        status: 1,
        authorId: 1,
        images: this.coverImagePreview
        ? [{ data: this.coverImagePreview, uploadedAt: new Date(), mimeType: this.getMimeTypeEnum(this.coverImageFile?.type || '') }]
        : [], 
        ratings: []
      };
  
      this.blogService.createBlog(newBlog).subscribe({
        next: (response) => {
          console.log('Blog successfully created:', response);
          this.resetForm();
        },
        error: (err) => console.error('Error creating blog:', err)
      });
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

  onTextareaSelect(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.startPos = textarea.selectionStart;
    this.endPos = textarea.selectionEnd;
  }

  onMarkdownInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.markdownContent = textarea.value;
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
