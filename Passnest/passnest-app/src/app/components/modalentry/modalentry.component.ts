import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AlertInput, ModalController, ToastController } from '@ionic/angular';
import { group } from 'console';
import { LogoutService } from 'src/app/services/logout.service';
import { Storage } from '@ionic/storage-angular';
import { NavController} from '@ionic/angular';

@Component({
  selector: 'app-modalentry',
  templateUrl: './modalentry.component.html',
  styleUrls: ['./modalentry.component.scss'],
})
export class ModalentryComponent  implements OnInit {

  handlerMessage = '';

  iduser !: number;
  accessToken !: string;

  isMenuOpen = false;
  
  @Input() entry: any;

  selectoptionforform = ''
  selectedOption = ''

  showSecondSelect: boolean = false;
  selectedValue!: string;
  
  showDropdown = false;
  selectedItem: string = ''
  subForm!: FormGroup;
  
  updateForm !: FormGroup;

  hashmap: any;
  color : any;

  passwordType: string = 'password';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private formBuilder: FormBuilder, 
    private toastController: ToastController,
    private router: Router,
    private service: LogoutService,
    private alertController: AlertController,
    private storage: Storage,
    private navController: NavController,
  ) {
    this.hashmap = service.gethashmap(); 
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      buttons: this.alertButtons,
      animated: true,
      cssClass: 'red-header'
    });

    await alert.present();
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.router.navigate(["/mainscreen"])
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.handlerMessage = 'Alert confirmed';
        this.deleteentry();
      },
    },
  ];

  deleteentry(){
    const apiUrl = 'http://localhost:8080/notes/deletenote/' + this.entry.id;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken
    })
    this.http.delete(apiUrl,{ headers: headers }).subscribe(
      (data) => {
      this.router.navigate(["/mainscreen"])
      this.modalCtrl.dismiss(null, 'delete');
    },
      (error) => {
        console.log(error);
      }
    )

  }

  selectItem(item: string) {
    console.log(item)
    this.selectedItem = item; 
    this.updateForm.controls['color'].setValue(item);
    this.showDropdown = false; 
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onFirstSelectChange(event: any) {
    this.selectedValue = event.detail.value;
    this.showSecondSelect = true;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.submitForm();
    this.modalCtrl.dismiss(null, 'save');
  }


  async createstorage(){
    await this.storage.create()
  }

  submitForm(){

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken
    })
    const body = {
      "nname": this.updateForm.value.nname,
      "nusername": this.updateForm.value.nusername,
      "nemail" : this.updateForm.value.nemail,
      "npass" : this.updateForm.value.npass,
      "nurl": this.updateForm.value.nurl,
      "ndesc": this.updateForm.value.ndesc,
      "color": this.updateForm.value.color,
    }

    const apiUrl = 'http://localhost:8080/notes/editnote/' + this.entry.id;
    this.http.post(apiUrl, body, { headers: headers }).subscribe((data) => {
      console.log(body)
      console.log(data)
      this.router.navigate(["/mainscreen"])
    },
      (error) => {
        console.log(body)
        console.log(error);
      }
    )
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  copyPasswordToClipboard(password: string) {
    if (password) {
      navigator.clipboard.writeText(password).then(
        () => {
          this.toastController.create({
            message: 'Password copied to clipboard',
            duration: 2000,
            color: 'success',
          }).then(toast => toast.present());
        },
        (err) => {
          console.error('Failed to copy password: ', err);
          this.toastController.create({
            message: 'Failed to copy password',
            duration: 2000,
            color: 'danger',
          }).then(toast => toast.present());
        }
      );
    } else {
      this.toastController.create({
        message: 'No password to copy',
        duration: 2000,
        color: 'warning',
      }).then(toast => toast.present());
    }
  }
  

  ngOnInit() {
    this.createstorage();
    this.storage.get('accessToken').then((value) => {
      this.accessToken = value
    })
    this.storage.get('iduser').then((value) => {
      this.iduser = value
    })
    this.updateForm = this.formBuilder.group({
      nname: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20)]],
      nusername: [''],
      nemail:['', Validators.email],
      npass: [this.entry.npass],
      nurl: ['', Validators.minLength(5)],
      ndesc: ['', Validators.minLength(5)],
      color: ['',[Validators.required]],
    })
    for(const [key,value] of this.hashmap.entries()){
      if (value === this.entry.color){
        this.color = key;
      }
    }
    this.selectedItem = this.color;
  }
}
