import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingService{

  public isPageLoading = true;
  public isProcessLoading = false;
  public processLoader;

  constructor(
      public loadingController: LoadingController,
  ) { }

  async presentSmallLoading(message){
    this.isProcessLoading = true;
    this.processLoader = await this.loadingController.create({
      message: message
    });
    await this.processLoader.present();
  }

  async dismissSmallLoading(){
    if(this.isProcessLoading) this.processLoader.dismiss();
  }

}
