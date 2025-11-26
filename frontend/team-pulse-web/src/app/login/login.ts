import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async submit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    try {
      await this.authService.login(username, password).toPromise();
      this.errorMessage = '';
      this.router.navigateByUrl('/standup'); // Angular-style navigation
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Invalid username or password';
    }
  }

  goToRegister() {
    this.router.navigate(['/signup']);
  }
}
