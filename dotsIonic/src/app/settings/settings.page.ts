import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';

// Services
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { LocalAuthService } from '../services/localAuth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
 
  
  public userData;

  public originalUserData;

  public dbData;

  public generalInfoEditable = false;
  
  constructor(
    public userService: UserService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private navController: NavController,
    private translate: TranslateService,
    private alertController: AlertController,
    public storageService: StorageService,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private route: ActivatedRoute,
    public localAuthService: LocalAuthService
  ) { }

  async ngOnInit() {
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    this.originalUserData = this.userData;
    console.log("***UserData", this.userData);


    this.loadingService.hidePageLoading();

  }

  async setLanguage(){
    this.translate.use(this.userData.Lang);
    
    this.storageService.set("DotsUserData.Lang", this.userData.Lang);
    console.log(this.storageService.get("DotsUserData"));
  }

  

  async saveGeneralInfo(){
    console.log(this.userData);
    this.generalInfoEditable = false;

    this.userService.updateUserData(this.userData).subscribe( async (data: [any]) => {

      console.log(data);

    });
  }

}
