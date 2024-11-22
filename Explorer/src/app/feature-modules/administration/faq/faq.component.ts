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
  isError: boolean = false;  // Dodato za grešku

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
    // Provera da li su oba polja prazna
    if (!this.questionInput || !this.answerInput) {
      this.isError = true;  // Ako nisu popunjena, postavite grešku
      return;  // Prekida izvršavanje funkcije dok se ne popune
    }

    this.isError = false;  // Resetovanje greške ako su oba polja popunjena

    const newFAQ: FAQDto = {
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
}
