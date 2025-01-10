import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Directive, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController, IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; 
import { NavController } from '@ionic/angular';


interface Sub {
  id: number;
  subname: string;
  suburlcancel?: string;
  substate: boolean;
  subdes: string;
  subicon: string;
}

@Component({
  selector: 'app-newsub',
  templateUrl: './newsub.page.html',
  styleUrls: ['./newsub.page.scss'],
})

export class NewsubPage implements OnInit {
  searchTerm = '';
  subs: Sub[] = [];
  filteredSubs: Sub[] = [];
  selectedSub: Sub | null = null;
  selectedCurrency: string = 'EUR';
  isMenuOpen = false;

  selectedOption = 'Never'
  selectoptionforform = 'Never'

  showSecondSelect: boolean = false;
  selectedValue!: string;

  showDropdown = false;
  selectedItem: string = '';

  subForm!: FormGroup;

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
  ) {
    this.fetchSubs();
  }

  selectItem(item: string) {
    console.log(item)
    this.selectedItem = item; 
    this.subForm.controls['color'].setValue(item);
    this.showDropdown = false; 
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onFirstSelectChange(event: any) {
    this.selectedValue = event.detail.value;
    this.showSecondSelect = true;
  }

  changeCurrency(){
    if(this.selectedCurrency === 'EUR'){
      this.selectedCurrency = 'USD'
    } else {
      this.selectedCurrency = 'EUR';
    }
  }

  fetchSubs() {
    const apiUrl = 'http://localhost:8080/subs/getsubs'
    this.http.get<Sub[]>(apiUrl).subscribe(
      (subs) => {
        this.subs = subs;
        this.filterSubs();
      },
      (error) => {
        console.log(error);
      }
    )
  }
  
  async openNotificationDialog() {
    const options = [
        {
          name: 'option1',
          label: 'Never',
          value: { option: 'never', label: 'Never' },
          checked: true
        },
        {
          name: 'option2',
          label: 'Same day',
          value: {option: 'sameday', label: 'Same day'}
        },
        {
          name: 'option3',
          label: '1 day before',
          value: {option: '1daybf', label: '1 day before'}
        },
        {
          name: 'option4',
          label: '2 days before',
          value: {option: '2daybf', label: '2 days before'}
        },
        {
          name: 'option5',
          label: '3 days before',
          value: {option: '3daybf', label: '3 days before'}
        },
        {
          name: 'option6',
          label: '1 week before',
          value: {option: '1weekbf', label: '1 week before'}
        },
        {
          name: 'option7',
          label: '2 weeks before',
          value: {option: '2weekbf', label: '2 weeks before'}
        },
        {
          name: 'option8',
          label: '1 month before',
          value: {option: '1monthbf', label: '1 month before'}
        },
        {
          name: 'option9',
          label: '3 months before',
          value: {option: '3monthbf', label: '3 months before'}
        },
        {
          name: 'option10',
          label: '6 months before',
          value: {option: '6monthbf', label: '6 months before'}
        }
    ];

    const alert = await this.alertController.create({
      header: 'Notification',
      message: 'When do you want to receive a notification? ',
      inputs: options.map(option => ({
        name: option.name,
        type: 'radio',
        label: option.label,
        value: option.value,
        checked: option.checked
      })),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (selectedOption) => {
            console.log(selectedOption);
            this.selectedOption = selectedOption.label;
            this.selectoptionforform = selectedOption.option;
          }
        }
      ]
    });
    await alert.present();
  }
  
  filterSubs() {
      if (this.searchTerm != '') {
        this.filteredSubs = this.subs.filter((sub) =>
          sub.subname.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredSubs = []
      }
  }

  selectSub(sub: Sub) {
    this.isMenuOpen = false;
    this.searchTerm = sub.subname;
    this.selectedSub = sub;
    this.filteredSubs = [];
  }

  onSearchTermChange(){
    if(this.selectedSub != null){
      if (this.searchTerm != this.selectedSub!.subname) {
            this.isMenuOpen = true;
            this.filterSubs();
          }
    }else {
      this.filterSubs();
    }
    
  }

  getDefaultImage(): string {
    return '../assets/imgs/subsi/defaulticon.png';
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
      "pname": this.subForm.value.pname,
      "currency": this.subForm.value.currency,
      "cycleType": this.subForm.value.cycleType,
      "cycleNumber": this.subForm.value.cycleNumber,
      "recentcharge": this.subForm.value.recentcharge,
      "color": this.subForm.value.color,
      "quantity": this.subForm.value.quantity,
      "notification": this.selectoptionforform,
      "subId" : this.selectedSub?.id
    }

    const apiUrl = 'http://localhost:8080/payments/createpayment/' + this.iduser;
    if(body.subId == undefined){
      body.subId = 6
    }
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
    this.subForm = this.formBuilder.group({
      pname: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20)]],
      currency: [''],
      cycleType: ['',[Validators.required]],
      cycleNumber: ['',[Validators.required, Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      recentcharge: ['',[Validators.required]],
      color: ['',[Validators.required]],
      quantity: ['',[Validators.required, Validators.min(0)]]
    })
  }
}
