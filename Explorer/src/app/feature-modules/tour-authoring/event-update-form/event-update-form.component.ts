import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventModel } from '../model/event.model';


const categoryMapping: { [key: string]: string } = {
  Concert: '0',
  MusicFestival: '1',
  FilmFestival: '2',
  FootballMatch: '3',
  BasketballMatch: '4'
};

@Component({
  selector: 'xp-update-form',
  templateUrl: './event-update-form.component.html',
  styleUrls: ['./event-update-form.component.css']
})
export class UpdateEventFormComponent implements OnInit {


  


  updateForm: FormGroup;
  @Input() event: EventModel | null = null;
  @Output() cancelUpdate = new EventEmitter<void>();
  @Output() eventUpdated = new EventEmitter<void>();

  imagePreview: string | ArrayBuffer | null = null;
  clearMarkersFlag: boolean = false;
  showErrorMessage = false;

  constructor(private service: TourAuthoringService) {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.event) {
      console.log(this.event);
      this.updateForm.patchValue({
        name: this.event.name,
        description: this.event.description,
        category: categoryMapping[this.event.category],
        image: this.event.image,
        latitude: this.event.latitude,
        longitude: this.event.longitude,
        startDate: this.formatDate(this.event.startDate),
        endDate: this.formatDate(this.event.endDate)
      });
      if (this.event.image?.data) {
        this.imagePreview = `data:${this.event.image.mimeType};base64,${this.event.image.data}`;
      }
    }
  }


  private formatDate(date: string | Date): string {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); // Uklanja uticaj vremenske zone
    return localDate.toISOString().split('T')[0]; // Vraća format YYYY-MM-DD
  }

  clearMarkers(): void {
    this.clearMarkersFlag = true;
  }

  onMarkersCleared(): void {
    setTimeout(() => {
      this.clearMarkersFlag = false;
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const mimeType = base64String.split(",")[0].split(":")[1].split(";")[0];
        const uploadedAt = new Date().toISOString();
        this.updateForm.patchValue({
          image: { data: base64String.split(',')[1], mimeType, uploadedAt }
        });
        this.updateForm.get('image')!.updateValueAndValidity();
        this.imagePreview = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.updateForm.patchValue({
      latitude: location.lat,
      longitude: location.lng
    });
  }

  updateEvent(): void {
    this.updateForm.markAllAsTouched();

    if (this.updateForm.valid) {
      const updatedEvent: EventModel = {
        ...this.event!,
        name: this.updateForm.value.name,
        description: this.updateForm.value.description,
        category: this.updateForm.value.category,
        image: this.updateForm.value.image,
        latitude: this.updateForm.value.latitude,
        longitude: this.updateForm.value.longitude,
        startDate: this.updateForm.value.startDate,
        endDate: this.updateForm.value.endDate
      };

      this.service.updateEvent(updatedEvent).subscribe((result) => {
        console.log('Event updated successfully.:', result);
        this.eventUpdated.emit(); 
      });
    console.log(updatedEvent);
    }
  }

  cancel(): void {
    this.cancelUpdate.emit();
  }

  clearForm(): void {
    this.updateForm.reset();
    this.imagePreview = null;
  }
}
