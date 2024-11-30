import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PersonalDairy } from '../../tour-execution/model/personalDiary.model';
import { Diary } from '../../tour-execution/model/diary.model';
import { Chapter } from '../../tour-execution/model/chapter.model';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-diaries',
  templateUrl: './personal-diaries.component.html',
  styleUrls: ['./personal-diaries.component.css']
})
export class DiariesComponent implements OnInit {
  diaries: Diary[] = [];
  chapters: Chapter[] = [];
  newChapter: Chapter = { chapterId: 0, title: '', createdAt: new Date(), text: '', personalDairyId: 0};
  selectedDiary: Diary | null = null;
  errorMessage: string | null = null;
  userId!: number;
  isNewChapterModalOpen = false;
  isAllChapterModalOpen = false;
  isModalOpen = false;
  chapterForm: FormGroup; // FormGroup za poglavlje7
  isEditingTitle = false; // Da li se uređuje naslov
  editedTitle: string = ''; // Privremeni naslov za uređivanje
  editedChapterIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService,
    private datePipe: DatePipe,
    private fb: FormBuilder // Inicijalizacija FormBuilder-a
  ) {
    // Kreiranje forme sa Reactive Forms
    this.chapterForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.loadDiaries(this.userId);
  }

  loadDiaries(userId: number): void {
    this.tourExecutionService.getDiaryForUser(userId).subscribe({
      next: (diaries) => {
        this.diaries = diaries;
        console.log(diaries);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load diaries.';
        console.error(error);
      }
    });
  }

  openAddChapterModal(diary: Diary): void {
    this.selectedDiary = diary;
    this.isNewChapterModalOpen = true;
  }

  openAllChapterModal(diary: Diary): void {
    this.selectedDiary = diary;
    this.getChaptersForDiary();
    this.isAllChapterModalOpen = true;
  }

  closeNewChapterForm(): void {
    this.isNewChapterModalOpen = false;
    this.resetChapterForm();
  }
  closeAllChapterModal(): void {
    this.isAllChapterModalOpen = false;
  }

  // Resetuje formu
  resetChapterForm(): void {
    this.chapterForm.reset();
  }

  // Obrada odabranog fajla
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString();
          this.newChapter.image = {
            data: base64String.split(',')[1],
            uploadedAt : new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSZ')!),
            mimeType: this.getMimeType(file.type),
          };
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  getMimeType(fileType: string): number {
    switch (fileType) {
      case 'image/jpeg':
        return 0; 
      case 'image/png':
        return 1; 
      case 'image/gif':
        return 2; 
      default:
        throw new Error('Unsupported file type');
    }
  }

  // Slanje poglavlja
  submitChapter(): void {
    if (this.selectedDiary && this.chapterForm.valid) {
      this.newChapter.personalDairyId = this.selectedDiary.id;
      this.newChapter.title = this.chapterForm.value.title;
      this.newChapter.text = this.chapterForm.value.text;
      this.newChapter.createdAt = new Date();

      this.tourExecutionService.addChapter(this.newChapter.personalDairyId, this.newChapter).subscribe({
        next: (response) => {
          this.closeNewChapterForm();
        },
        error: (err) => {
          console.error('Error adding chapter', err);
          alert('Error adding chapter');
        }
      });
    }
  }
  getChaptersForDiary(): void {
    console.log(this.selectedDiary?.id);
    if (this.selectedDiary)
    {
        this.tourExecutionService.getChaptersForDiary(this.selectedDiary.id).subscribe({
            next: (chapterss: any) => {
              console.log('API Response:', chapterss);
      
              // Ispisivanje samo rezultata (ako je 'results' deo odgovora)
              console.log('Chapters:', chapterss);
              this.chapters = chapterss;
            },
            error: (error) => {
              console.error('Error fetching chapters:', error);
            }});
          }
    }


    editTitle() {
        this.isEditingTitle = true;
        if(this.selectedDiary)
            this.editedTitle = this.selectedDiary.title;
      }
    
      saveTitle() {
        if(this.selectedDiary)
        {

        if (this.editedTitle.trim() && this.selectedDiary) {
          this.selectedDiary.title = this.editedTitle.trim();
          this.isEditingTitle = false;
        }
    
        this.tourExecutionService.editDiary(this.selectedDiary).subscribe({
          next: (response) => {
            // IZMENIO SI DNEVNIK
          },
          error: (err) => {
            console.error('Greška prilikom izmene dnevnika:', err);
            alert('Došlo je do greške!');
          },
        });
    }
}
    
      cancelEditTitle() {
        this.isEditingTitle = false;
        this.editedTitle = '';
      }
    
      closeModal(): void {
        this.isAllChapterModalOpen = false;
        this.editedChapterIndex = null; // Resetujemo uređivanje
      }
      deleteDiary(): void {
        if (confirm('Da li ste sigurni da želite da obrišete dnevnik?') && this.selectedDiary) {
    
          this.tourExecutionService.deleteDiary( this.selectedDiary).subscribe({
            next: (response) => {
              this.isAllChapterModalOpen = false; 
            this.getChaptersForDiary();
                  },
            error: (err) => {
              console.error('Greška prilikom izbrisa dnevnik:', err);
              alert('Došlo je do greške!');
            },
          });
    
    
          this.closeModal();
        }
      }
      editChapter(index: number): void {
        this.editedChapterIndex = index;
      }
    
      saveChapter(index: number): void {
        const chapter = this.chapters[index];
        this.tourExecutionService.editChapter( chapter).subscribe({
          next: (response) => {
            // IZMENIO SI poglavlje
          },
          error: (err) => {
            console.error('Greška prilikom izmene poglavlja:', err);
            alert('Došlo je do greške!');
          },
        });
          this.editedChapterIndex = null; // Završeno uređivanje
      }
    
      cancelEdit(): void {
        this.editedChapterIndex = null; // Otkaži uređivanje
      }
    
      deleteChapter(index: number): void {
        if (confirm(`Da li ste sigurni da želite da obrišete poglavlje ${index + 1}?`)) {
          const chapter = this.chapters[index];
          this.tourExecutionService.deleteChapter( chapter).subscribe({
            next: (response) => {
            this.getChaptersForDiary();
                  },
            error: (err) => {
              console.error('Greška prilikom izbrisa poglavlja:', err);
              alert('Došlo je do greške!');
            },
          });
        }
      }

      isAllowed(diary: Diary | null): boolean {
        if (!diary || !diary.closedAt) {
          return true; // Ako je dnevnik null ili nema closedAt, dozvoljeno je
        }
      
        const currentTime = new Date();
        const closedTimePlusThreeDays = new Date(diary.closedAt);
        closedTimePlusThreeDays.setDate(closedTimePlusThreeDays.getDate() + 3);
      
        return currentTime <= closedTimePlusThreeDays; // Dozvoljeno ako nije prošlo više od 3 dana
      }
}

