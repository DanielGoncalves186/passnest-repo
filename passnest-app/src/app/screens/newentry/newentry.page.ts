import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Directive, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController, IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; 
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  isMenuOpen = false;

  selectedOption = 'Never'
  selectoptionforform = 'Never'

  showSecondSelect: boolean = false;
  selectedValue!: string;

  showDropdown = false;
  selectedItem: string = '';

  entryForm!: FormGroup;

  iduser !: number;
  accessToken !: string;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder, 
    private toastController: ToastController,
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private navController: NavController
  ) { }

  selectItem(item: string) {
    console.log(item)
    this.selectedItem = item; 
    this.entryForm.controls['color'].setValue(item);
    this.showDropdown = false; 
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onFirstSelectChange(event: any) {
    this.selectedValue = event.detail.value;
    this.showSecondSelect = true;
  }

  async createstorage() {
    await this.storage.create()
  }

  cancel(){
    this.navController.navigateRoot('/mainscreen')
  }

    submitForm() {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
      const body = {
        "nname": this.entryForm.value.nname,
        "nusername": this.entryForm.value.nusername,
        "nemail": this.entryForm.value.nemail,
        "npass": this.entryForm.value.npass,
        "nurl": this.entryForm.value.nurl,
        "ndesc": this.entryForm.value.ndesc,
        "color": this.entryForm.value.color
      }
  
      const apiUrl = 'http://localhost:8080/notes/createnote/' + this.iduser;
      this.http.post(apiUrl, body, { headers: headers }).subscribe((data) => {
        console.log(body)
        console.log(data)
        this.navController.navigateRoot('/mainscreen')
      },
        (error) => {
          console.log(body)
          console.log(error);
        }
      )
    }

    ngOnInit() {
      this.createstorage();
      this.storage.get('accessToken').then((value) => {
        this.accessToken = value
        console.log('accessToken = ' + this.accessToken)
      })
      this.storage.get('iduser').then((value) => {
        this.iduser = value;
        console.log('iduser = ' + this.iduser)
      })
      this.entryForm = this.formBuilder.group({
        nname: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20)]],
        nusername: [''],
        nemail:['', Validators.email],
        npass: [''],
        nurl: ['', Validators.minLength(5)],
        ndesc: ['', Validators.minLength(5)],
        color: ['',[Validators.required]],
      })
    }

}
