import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

// Loading Service
// Implements showing and hiding loadings

@Injectable()
export class LoadingService{

  public isPageLoading = true;                // Controlls full-screen loader
  public isProcessLoading = false;            // Controlls small loading
  public processLoader;

  constructor(
      public loadingController: LoadingController,
  ) { }

  // Show small loading alert with custom message
  async presentSmallLoading(message){
    this.isProcessLoading = true;
    this.processLoader = await this.loadingController.create({
      message: message
    });
    await this.processLoader.present();
  }

  // Hide small loading
  async dismissSmallLoading(){
    if(this.isProcessLoading) this.processLoader.dismiss();
  }

}
