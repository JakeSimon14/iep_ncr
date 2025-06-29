import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,InputsModule,ButtonsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;
  submitted = false;
  error: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      ssoid: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  OnInit(): void {
     localStorage.removeItem('token');

    localStorage.removeItem('GridFiltersData');
    localStorage.removeItem('GridFilters');

    localStorage.removeItem('ContractTreeFilters');
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { ssoid, password } = this.loginForm.value;
debugger;
    this.http.post<any>('http://localhost:5000/api/auth/login', {
      ssoid,
      password
    }).subscribe({
      next: (res) => {
        debugger;
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);

        
      },
      error: (err) => {
        this.error = err.error?.error || 'Invalid ssoid or password';
      }
    });
  }
}
