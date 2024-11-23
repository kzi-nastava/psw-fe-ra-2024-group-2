import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Registration, UserRole } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  passwordMismatch: boolean = false;
  emailTouched = false;
  readonly UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    userRole: new FormControl('', [Validators.required]),
  });

  register(): void {
    const password = this.registrationForm.value.password;
    const confirmPassword = this.registrationForm.value.confirmPassword;
    this.passwordMismatch = password !== confirmPassword;
    if (this.passwordMismatch) {
      return;
    }

    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      userRole: Number(this.registrationForm.value.userRole) as UserRole || UserRole.Tourist,
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
    }
  }

  getEmailErrorMessage(): string {
    const emailControl = this.registrationForm.get('email');
    if (emailControl?.errors?.['email'] && emailControl.value !== '') {
      return 'Invalid Email Format';
    }
    return '';
  }
  onEmailBlur() {
    this.emailTouched = true;
  }
  onEmailClick(){
    this.emailTouched = false;
  }
}
