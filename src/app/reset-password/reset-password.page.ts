import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';  // Obtenemos el token desde la URL
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { newPassword, confirmPassword } = this.resetForm.value;
      if (newPassword !== confirmPassword) {
        return alert('Las contraseñas no coinciden');
      }

      this.http.post('http://localhost:3000/reset-password', { token: this.token, newPassword })
        .subscribe({
          next: () => {
            alert('Contraseña restablecida exitosamente');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            alert('Error al restablecer la contraseña');
            console.error(error);
          }
        });
    }
  }
}