import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { FAQDto } from '../model/faq.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: FAQDto[] = [];
  user: any;
  questionInput: string = '';
  answerInput: string = '';
  questionInputEdit: string = '';
  answerInputEdit: string = '';
  isError: boolean = false; 
  isEditError: boolean = false;
  editModeIndex: number | null = null;

  constructor(private service: AdministrationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.loadFAQ();
  }

  private loadFAQ(): void {
    this.service.getAllFAQs().subscribe({
      next: (result: any) => {
        this.faqs = result.results;
      },
      error: (err: any) => console.error('Failed to load FAQs', err)
    });
  }

  addFAQ(): void {
    if (!this.questionInput || !this.answerInput) {
      this.isError = true;  
      return; 
    }

    this.isError = false; 

    const newFAQ: FAQDto = {
      id: 0,
      question: this.questionInput,
      answer: this.answerInput,
      createdDate: new Date().toISOString(),
    };

    this.service.createFAQ(newFAQ, this.user.id).subscribe({
      next: (faq: FAQDto) => {
        this.faqs.push(faq);
        this.questionInput = '';
        this.answerInput = '';
      },
      error: (err: any) => console.error('Failed to add FAQ', err),
    });
  }

  toggleEditMode(index: number | null): void {
    this.editModeIndex = index;

    if (index !== null) {
      const faqToEdit = this.faqs[index];
      this.questionInputEdit = faqToEdit.question;
      this.answerInputEdit = faqToEdit.answer;
    } else {

      this.questionInputEdit = '';
      this.answerInputEdit = '';
      this.isEditError = false;
    }
  }

  saveEdit(index: number): void {
    if (!this.answerInputEdit || !this.questionInputEdit) {
      this.isEditError = true;
      return; 
    }
  
    this.isEditError = false;
  
    const editedFAQ: FAQDto = {
      ...this.faqs[index],
      question: this.questionInputEdit,
      answer: this.answerInputEdit,
      lastUpdatedDate: new Date().toISOString(),
    };
  
    const faqId = this.faqs[index].id; 
    this.editFAQ(editedFAQ, faqId);
    this.toggleEditMode(null);
  }

  editFAQ(editedFAQ: FAQDto, faqId: number): void {
    this.service.editFAQ(editedFAQ, this.user.id, faqId).subscribe({
      next: (updatedFAQ: FAQDto) => {
        const index = this.faqs.findIndex(faq => faq.id === updatedFAQ.id);
        if (index !== -1) {
          this.faqs[index] = updatedFAQ;
        }
      },
      error: (err: any) => console.error('Failed to edit FAQ', err),
    });
  }
}
