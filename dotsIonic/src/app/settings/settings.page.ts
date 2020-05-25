import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';

// Services
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
 
  
  public userData;

  public dbData;

  public chosenLanguage;

  public userParams = {
    Titles: [],
    Values: {},
    ParamData: []
  }
  
  constructor(
    public userService: UserService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private navController: NavController,
    private translate: TranslateService,
    private alertController: AlertController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    console.log("***UserData", this.userData);


    this.loadingService.hidePageLoading();

  }

  async setLanguage(){
    this.translate.use(this.chosenLanguage);

    this.userData.Lang = this.chosenLanguage;
  }

  async ionViewCanLeave() {
    console.log("will leave");
    const shouldLeave = await this.confirmLeave();
    return shouldLeave;
  }
  
  async confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    let alert = await this.alertController.create({
      message: 'Do you want to leave the page?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => resolveLeaving(false)
        },
        {
          text: 'Yes',
          handler: () => resolveLeaving(true)
        }
      ]
    });
    await alert.present();
    return canLeave
  }

}
