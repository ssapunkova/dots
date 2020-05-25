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

  public appearanceChanged = false;
  public userDataChanged = false;
  
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

  async editGeneralInfo(){

    let that = this;

    let alert = this.alertController.create({
      header: this.translate.instant("EditGeneralInfo"),
      message: "Enter password",
      inputs: [
        {
          name: "Password",
          type: 'password'
        }
      ],
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {

            console.log(data, this.userData)

            if(data.Password == ""){
              that.errorToastAndAlertService.showErrorToast(this.translate.instant("EnterPassword"));
              return false;
            }
            else {
              
              that.localAuthService.comparePasswords(data.Password, this.userData.Password).subscribe((result: any) => {
                console.log(result)
              });

            }
          }
        }
      ]
    });

    await (await alert).present();

  }

  async saveChanges(){
    console.log(this.userData);
    this.userDataChanged = false;
  }

  async discardChanges(){
    this.userData = this.originalUserData;
    this.userDataChanged = false;
  }

}
