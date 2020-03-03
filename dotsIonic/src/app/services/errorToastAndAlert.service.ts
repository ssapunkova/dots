import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { LoadingService } from './loading.service';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorToastAndAlertService{

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      public translate: TranslateService,
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

    await this.loadingService.hideProcessLoading();
    let alert = await this.alertController.create({
      header: message,
      message: this.translate.instant("GeneralErrorMessage") + "<a href='mailto:elenakikiova@mail.ru'>elenakikiova@mail.ru</a>",
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }

}
