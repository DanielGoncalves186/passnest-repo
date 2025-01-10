import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent  } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { error } from 'console';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LogoutService implements HttpInterceptor{


  hashmap = new Map <string,string>();

  constructor(
    private router: Router,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.hashmap.set('#f53d3d','danger');
    this.hashmap.set('#3880ff','primary');
    this.hashmap.set('#2dd36f','success');
    this.hashmap.set('#8b8b8b','medium');
    this.hashmap.set('#222428','dark');
    this.hashmap.set('#ffc409','warning');
    this.hashmap.set('#3dc2ff','secondary');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        () => {},
        (error: any) => {
          if(error instanceof HttpErrorResponse && error.status === 401){
            this.logout();
          }
        }
      )
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

  async createstorage() {
    await this.storage.create()
  }

  gethashmap(){
    return this.hashmap;
  }

  public logout(){
    this.storage.clear().then(() => {
      this.router.navigate(['/login'])
      this.presentToast('Session expired')
    })
  }
}
