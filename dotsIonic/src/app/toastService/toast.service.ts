import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService{

  constructor(
      public toastController: ToastController,
  ) { }

  async showErrorToast(message){
    const errorToast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger"
    });
    errorToast.present();
  }

}
