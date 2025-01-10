import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; 
import { access } from 'fs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder, 
    private toastController: ToastController,
    private router: Router,
    private storage: Storage
  ){}


  async submitform(){
    const body = {"email": this.loginForm.value.email, "password": this.loginForm.value.password}
    const apiUrl = 'http://localhost:8080/auth/login';
    this.http.post(apiUrl, body).subscribe((data) => {
      const newdata = Object.values(data)
      console.log(data)
      this.storage.set('accessToken', newdata[0])
      this.storage.set('emailuser', newdata[1])
      this.storage.set('username', newdata[2])
      this.storage.set('iduser', newdata[3])
      this.storage.set('addressuser', newdata[4])
      this.storage.set('dateuser', newdata[5])
      this.router.navigate(['mainscreen']);
    },
      (error) => {
        console.log(error);
        this.presentToast(error.error.message);
      }
    )
  }
    
  async presentToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  async createstorage(){
    await this.storage.create()
  }

  ngOnInit() {
    this.createstorage()
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

}


