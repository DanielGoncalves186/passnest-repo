import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; 
import { LogoutService } from 'src/app/services/logout.service';

import { ModalentryComponent } from 'src/app/components/modalentry/modalentry.component';


interface Entry{
  id: number;
  userId: number;
  nname: string;
  nusername: string;
  nemail: string;
  npass: string;
  nurl: string;
  ndesc: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.page.html',
  styleUrls: ['./mainscreen.page.scss'],
})

export class MainscreenPage implements OnInit {

  iduser !: number;
  accessToken !: string;

  entrys: Entry[] = [];

  hashmap: any;

  remainingmap = new Map<number,string>;

  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder, 
    private toastController: ToastController,
    private router: Router,
    private storage: Storage,
    private modalCtrl: ModalController,
    private service: LogoutService
  ){
    this.hashmap = service.gethashmap();
  }


  async openModal(entry: any){
    const modal = await this.modalCtrl.create({
      component: ModalentryComponent,
      componentProps: {
        entry: entry
      }
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
    modal.onDidDismiss().then((data) => {
      const role = data.role;
      if (role === 'save') {
        this.presentToast('Subscription edited successfully!');
        this.entrys = [];
        this.getAllNotes();
        window.location.reload();
      }
      else if (role === 'delete') {
        this.presentToast('Subscription deleted successfully!');
        this.entrys = [];
        this.getAllNotes();
      }
    });
  }

  async presentToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
  
  async createstorage(){
    await this.storage.create()
  }

  getAllNotes() {
    const apiUrl = 'http://localhost:8080/notes/shownotes/' + this.iduser
    this.http.get<Entry[]>(apiUrl).subscribe({
      next: (data) => {
        this.entrys = data;
        for (const entry of data){
          entry.color = this.hashmap.get(entry.color);
        }
        console.log('Notes retrieved successfully:', data);
      },
      error: (error) => {
        console.error('Error retrieving notes:', error);
        this.presentToast('Failed to load notes. Please try again.');
      }
    });
  }

  ionViewDidEnter(){
    this.storage.get('iduser').then((value) => {
      this.iduser = value
      this.getAllNotes();
    })
  }

  ngOnInit() {
    this.createstorage()
    this.storage.get('accessToken').then((value) => {
      this.accessToken = value
    })
  }
}
