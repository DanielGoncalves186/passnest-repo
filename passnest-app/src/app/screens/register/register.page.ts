import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router
  ) { }


  submitForm() {
    const body = {
      "username": this.registerForm.value.username,
      "email": this.registerForm.value.email,
      "password": this.registerForm.value.password,
    }
    const apiUrl = 'http://localhost:8080/auth/register';
    this.http.post(apiUrl, body).subscribe((data) => {
      console.log(data)
      this.router.navigate(['/login'])
      this.presentToast1('Please verify your email!')
    },
      (error) => {
        console.log(error);
        this.presentToast(error.error.message);
      }
    )
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  async presentToast1(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(20)]]
    });
  }
}
