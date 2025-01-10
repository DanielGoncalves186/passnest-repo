import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit , OnDestroy {
  show: boolean = true;
  emailuser!: string;
  username!: string;
  subscription!: Subscription;

  showDropdown = false;

  constructor(
    private location: Location,
    private navcontroller: NavController,
    private storage: Storage,
    private router: Router
  ) {

    //this.subscription = this.router.events.subscribe(events => {
      //if (events instanceof NavigationEnd){
        let path = this.location.path();
        if (path == '/login' || path == '/register') {
          this.show = false
        } else {
          this.show = true
        }
      //}
    //})
  }
  
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  async createstorage() {
    await this.storage.create()
  }

  public async signout(){
    try{
      await this.storage.clear()
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error)
    }
    
  }

  ngOnInit() {
    this.createstorage()
    this.storage.get('emailuser').then((val) => {
      this.emailuser = val;
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    });
  }
  ngOnDestroy() {
    if (this.subscription){
      this.subscription.unsubscribe()
    }
  }
}
