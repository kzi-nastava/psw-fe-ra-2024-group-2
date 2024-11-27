import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TouristPosition } from '../model/tourist-position';
import { ProfileService } from '../profile.service';
import { Person } from '../model/person';
import { Chapter } from '../../tour-execution/model/chapter.model';
import { Diary } from '../../tour-execution/model/diary.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { TourExecution } from '../../tour-execution/model/tourExecution-model';
import { Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { ChangeDetectorRef } from '@angular/core';
import { PagedResult } from '../../blog/blog.module';
import { EventModel } from '../../tour-authoring/model/event.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent {
  touristPosition: TouristPosition | null = null;
  person: Person | null = null;
  tourExecution: TourExecution; 
  executedCheckpoints : any[] = [];
  checkpointCordinates: any[] = [];
  currentExeCheckpoints: any[] = [];
  checkpoints: Checkpoint[] = [];
  chapters: Chapter[] = [];
  user: User | undefined;
  clearMarkersFlag: boolean = false;
  currentTouristPosition: TouristPosition | null = null;
  intervalId: any;
  isNewChapterModalOpen = false;
  createDiaryModal = false;
  secret: string | null = null;
  events: any[] = [];
  selectedImage: File | null = null;
  isModalOpen: boolean = false;
  isEditingTitle = false; // Da li se uređuje naslov
  editedTitle: string = ''; // Privremeni naslov za uređivanje
  editedChapterIndex: number | null = null; // Trenutno uređivano poglavlje
  diary: Diary ={
    id:0,
    tourExecutionId: 0,
    userId: 0,
    tourId: 0,
    title: '',
    createdAt: new Date(),
    closedAt: new Date(),
    
  };
  newChapter: Chapter = {
    chapterId: 0,
    title: '',
    createdAt: new Date(),
    text: '',
    personalDairyId: 0,
    /*image: {
      data: '',
      uploadedAt: new Date(),
      mimeType : 0
    }*/
  };
  
  constructor(private service: ProfileService, private authService: AuthService, private execService: TourExecutionService, private router: Router,  private cdr: ChangeDetectorRef, private datePipe: DatePipe  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user?.id) {
        this.service.getTouristPosition(this.user.id).subscribe({
          next: (per: Person) => {
            this.person = per;
            this.touristPosition = per.touristPosition;
            localStorage.setItem('touristPosition', JSON.stringify(this.touristPosition));
            this.startPositionCheckInterval(); 
          },
          error: (error) => {
            console.error('Error retrieving tourist position:', error);
          }
        });
        this.execService.loadTourExecution(this.user.id).subscribe({next: (execution: TourExecution) => {
          this.tourExecution = execution;
          this.loadDiary();
          this.updateCheckpoints();
        }});
      } else {
        console.error('User ID is not defined.');
      }
    });
  }
  loadDiary(): void {
    const tourExecutionId = this.tourExecution.id;

    if (tourExecutionId) {
      this.execService.getDiaryByTourExecutionId(tourExecutionId).subscribe({
        next: (response: any) => {
          // Mapiranje odgovora na Diary model
          this.diary = {
            tourExecutionId: response.tourExecutionId,
            id:response.id,
            userId: response.userId,
            tourId: response.tourId,
            title: response.title,
            createdAt: new Date(response.createdAt),
            closedAt: new Date(response.closedAt)
          };

        },
        error: (err) => {
          console.error('Greška prilikom preuzimanja dnevnika:', err);
        }
      });
    } else {
      console.error('tourExecutionId nije definisan.');
    }
  }
  getChaptersForDiary(): void {
    this.execService.getChaptersForDiary(this.diary.id).subscribe({
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
    openModal(): void {
      this.getChaptersForDiary();
      this.isModalOpen = true; 
  }
  openModalCreate(): void {
    this.createDiaryModal=true;
  }
  closeCreateDiaryModal(): void {
    this.createDiaryModal = false;
    this.diary.title='';
  
  }
  submitDiaryForm(): void {
    this.diary.tourExecutionId= this.tourExecution.id;
    this.diary.userId= this.tourExecution.userId;
    this.diary.tourId= this.tourExecution.tourId;
    this.diary.createdAt= new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSZ')!);
    this.execService.createDiary(this.diary).subscribe({
      next: (response) => {
        this.loadDiary();
        this.createDiaryModal = false;
        this.openModal();
      },
      error: (err) => {
        console.error('Greška prilikom dodavanja poglavlja:', err);
        alert('Došlo je do greške!');
      },
    });

  }

  editTitle() {
    this.isEditingTitle = true;
    this.editedTitle = this.diary.title;
  }

  saveTitle() {
    if (this.editedTitle.trim()) {
      this.diary.title = this.editedTitle.trim();
      this.isEditingTitle = false;
    }

    this.execService.editDiary( this.diary).subscribe({
      next: (response) => {
        // IZMENIO SI DNEVNIK
      },
      error: (err) => {
        console.error('Greška prilikom izmene dnevnika:', err);
        alert('Došlo je do greške!');
      },
    });
    



  }

  cancelEditTitle() {
    this.isEditingTitle = false;
    this.editedTitle = '';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editedChapterIndex = null; // Resetujemo uređivanje
  }
  addNewChapter(): void {
    this.isNewChapterModalOpen = true;
  }

  closeNewChapterForm() {
    this.isNewChapterModalOpen = false;
  }

  deleteDiary(): void {
    if (confirm('Da li ste sigurni da želite da obrišete dnevnik?')) {

      this.execService.deleteDiary( this.diary).subscribe({
        next: (response) => {
          this.isModalOpen = false; 
          this.diary.id=0;
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
    this.execService.editChapter( chapter).subscribe({
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
      this.execService.deleteChapter( chapter).subscribe({
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
  updateCheckpoints(): void {
    const checkpointIds = this.tourExecution.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt === null)
          .map(checkpoint => checkpoint.checkpointId);
        
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.executedCheckpoints = checkpoints.results;
             this.checkpointCordinates =  this.getCheckpointCoordinates();
            },
            error: (error) => {
              console.error('Error fetching checkpoints:', error);
          }});
  }




  getCheckpointCoordinates(): { latitude: number, longitude: number }[] {

    if (!this.touristPosition || !this.tourExecution) {
      return [];
    }
    return [
      { latitude: this.touristPosition.latitude, longitude: this.touristPosition.longitude, name : this.person?.name || 'Tourist', surname : this.person?.surname || '' },
      ...this.executedCheckpoints
    ];
  }



  startPositionCheckInterval(): void {
    this.intervalId = setInterval(() => {
      const storedPosition = JSON.parse(localStorage.getItem('touristPosition') || '{}');
      if (storedPosition.latitude !== this.touristPosition?.latitude || storedPosition.longitude !== this.touristPosition?.longitude) {
        this.updateTouristPosition();
      }
    }, 10000); 
  }

  clearMarkers(){
    this.clearMarkersFlag = true;
  }
  onMarkersCleared(): void {
    setTimeout(() => {
      this.clearMarkersFlag = false; 
    });
  }

  onLocationSelected(event: { lat: number; lng: number }): void {
    const { lat, lng } = event;

    if(!this.touristPosition)
    {
      this.touristPosition = { latitude: lat, longitude: lng };
      this.updateTouristPosition();
    }

    this.touristPosition = { latitude: lat, longitude: lng };

  }

  updateTouristPosition(): void {
    if (this.user?.id && this.touristPosition) {
      this.service.updateTouristPosition(this.user.id, this.touristPosition).subscribe({
        next: (updatedPerson: Person) => {
          this.touristPosition = updatedPerson.touristPosition;
          localStorage.setItem('touristPosition', JSON.stringify(this.touristPosition));
        },
        error: (error) => {
          console.error('Error updating tourist position:', error);
        }
      });
      this.execService.checkTouristPosition(this.touristPosition).subscribe({
        next: (currentExe: TourExecution) => {
          // KOMPARACIJA OVDE
          const checkpointIds = currentExe.tourExecutionCheckpoints
          .filter(checkpoint => checkpoint.arrivalAt !== null)
          .map(checkpoint => checkpoint.checkpointId);
          
          this.execService.getTourCheckpoints(checkpointIds).subscribe({
            next: (checkpoints: any) => {
              this.currentExeCheckpoints = checkpoints.results;
              this.currentExeCheckpoints.forEach(ch => {
                if(this.secret != ch.secret){
                  this.secret = ch.secret;
                }
              });
              this.currentExeCheckpoints = [];
            },
            error: (error) => {
              console.error('Error fetching checkpoints:', error);
          }});

          this.tourExecution = currentExe; 
          this.updateCheckpoints();
          
        },
        error: (error) => {
          console.error('Error checking tourist position:', error);
        }

      });
      this.execService.GetAllEventsWithinRange(this.touristPosition).subscribe({
        next: (result : PagedResult<EventModel>) => {
          console.log(result);
          this.events = result.results;
          console.log(this.events);
        }
      });
    }
  }


  joinEvent(event: EventModel): void {

    this.execService.acceptEvent(event).subscribe({
      next: (response) => {
        console.log('Tour started successfully!', response);
        this.router.navigate(['/position-simulator']);
      },
      error: (error) => {
        console.error('Failed to start the tour:', error);
      }
    });

  }
  showSecret(sec: any): void{
    this.secret = sec;
    //this.cdr.detectChanges(); // Trigger change detection
  }

  endTour(): void {
    this.execService.endTour(this.tourExecution).subscribe({
      next: (execution: TourExecution) => {
        this.tourExecution = execution;
        this.updateCheckpoints();
        this.router.navigate(['/']); // Navigate on success
      },
      error: (error) => {
        console.error('Error ending tour:', error);
      }
    });
  }


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
  
  submitChapter() {
    this.newChapter.personalDairyId= this.diary.id;
    this.newChapter.createdAt = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSZ')!);
    this.execService.addChapter( this.newChapter.personalDairyId, this.newChapter).subscribe({
      next: (response) => {
        this.resetFields();
        this.getChaptersForDiary();
        this.isNewChapterModalOpen = false;
      },
      error: (err) => {
        console.error('Greška prilikom dodavanja poglavlja:', err);
        alert('Došlo je do greške!');
      },
    });
    
  }
    resetFields(): void {
      this.newChapter.title = '';
      this.newChapter.text = '';
      this.newChapter.image = undefined; // Resetovanje slike
      this.selectedImage = null; // Resetovanje izabrane datoteke
    
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Resetuje prikaz datoteke u input polju
      }
    }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

