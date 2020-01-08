import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

// Loading Service
// Implements showing and hiding loadings

@Injectable()
export class LoadingService{

  public isPageLoading = true;                // Controlls full-screen loader
  public processLoader = null;

  constructor(
      public loadingController: LoadingController,
  ) { }

  // Show small loading alert with custom message
  async presentSmallLoading(message){
    this.processLoader = await this.loadingController.create({
      message: message
    });
    await this.processLoader.present();
  }

  // Hide small loading
  async dismissSmallLoading(){
    if(this.processLoader) await this.processLoader.dismiss();
  }

}
