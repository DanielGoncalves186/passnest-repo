import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout.service';

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.page.html',
  styleUrls: ['./accountinfo.page.scss'],
})
export class AccountinfoPage implements OnInit {

  username !: string;
  emailuser !: string;
  address !: string;
  dateuser !: string;
  updateForm!: FormGroup;
  iduser !: number;
  accessToken !: string;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private logoutService: LogoutService
  ) { }

  submitForm() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken
    })
    const body = {
      "username": this.updateForm.value.username,
      "email": this.updateForm.value.email,
      "address": this.updateForm.value.address,
      "birthdate": this.updateForm.value.dateuser,
    }
    const updatedUsername = this.updateForm.value.username;
    const updatedEmail = this.updateForm.value.email;
    const updatedAddress = this.updateForm.value.address;
    const updatedDate = this.updateForm.value.dateuser;

    const apiUrl = 'http://localhost:8080/profile/editprofile/' + this.iduser;
    this.http.post(apiUrl, body, { headers: headers }).subscribe((data) => {
      console.log(body);
      console.log(data);
      if (this.updateForm.value.username !== '' && this.updateForm.value.username !== undefined && this.updateForm.value.username !== null) {
        this.storage.set('username', updatedUsername)
      }
      if (this.updateForm.value.email !== '' && this.updateForm.value.email !== undefined && this.updateForm.value.email !== null) {
        this.storage.set('emailuser', updatedEmail)
      }
      if (this.updateForm.value.address !== '' && this.updateForm.value.address !== undefined && this.updateForm.value.address !== null) {
        this.storage.set('addressuser', updatedAddress)
      }
      if (this.updateForm.value.dateuser !== '' && this.updateForm.value.dateuser !== undefined && this.updateForm.value.dateuser !== null) {
        this.storage.set('dateuser', updatedDate)
      }
      this.storage.set('profileUpdated', 'true');
      window.location.reload();
    },
      (error) => {
        console.log(error);
        if(error.status != 401)
        this.presentToast(error.error.error)
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
  async greenToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async createstorage() {
    await this.storage.create()
  }

  ngOnInit() {
    this.createstorage()

    this.updateForm = this.formBuilder.group({
      username: ['', [Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', Validators.email],
      address: ['', Validators.minLength(5)],
      dateuser: ['']
    });

    this.storage.get('accessToken').then((value) => {
      this.accessToken = value
      console.log('accessToken = ' + this.accessToken)
    })
    this.storage.get('emailuser').then((value) => {
      console.log('emailuser = ' + value)
      this.emailuser = value;
    })
    this.storage.get('username').then((value) => {
      console.log('username = ' + value)
      this.username = value;
    })
    this.storage.get('iduser').then((value) => {
      this.iduser = value;
      console.log('iduser = ' + this.iduser)
    })
    this.storage.get('addressuser').then((value) => {
      console.log('addressuser = ' + value)
      this.address = value;
      if (this.address === null) {
        this.address = 'Insert an address'
      }
    })
    this.storage.get('dateuser').then((value) => {
      console.log('dateuser = ' + value)
      this.dateuser = value;
      if (this.dateuser === null) {
        this.dateuser = 'dd/mm/yyyy'
      }
    })
    this.storage.get('profileUpdated').then((value) => {
      if(value === 'true') {
        this.storage.remove('profileUpdated');
        this.greenToast('Profile updated successfuly!');
      }
    });
  }
}
