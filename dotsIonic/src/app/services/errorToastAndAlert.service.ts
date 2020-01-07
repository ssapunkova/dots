import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { LoadingService } from './loading.service';

@Injectable()
export class ErrorToastAndAlertService{

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      public loadingService: LoadingService
  ) { }

  async showErrorToast(message){
    const errorToast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger"
    });
    errorToast.present();
  }

  // Show error alert with footer for contacting the admin
  async showErrorAlert(message){

    await this.loadingService.dismissSmallLoading();
    let alert = await this.alertController.create({
      header: message,
      message: "Something went wrong. Contact admin: <a href='mailto:elenakikiova@mail.ru'>elenakikiova@mail.ru</a>",
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }

}
