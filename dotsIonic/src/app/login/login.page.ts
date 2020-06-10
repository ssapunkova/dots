import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

// Services
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { LocalAuthService } from '../services/localAuth.service';
import { StorageService } from '../services/storage.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordVisible = false;

  public fbUser: SocialUser;
  public fbLoggedIn: boolean;

  public userData;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuController: MenuController,
    public loadingService: LoadingService,
    private translate: TranslateService,
    public alertController: AlertController,
    private localAuthService: LocalAuthService,
    private formBuilder: FormBuilder,
    public storageService: StorageService,
    public userService: UserService,
    private authService: AuthService,
    public errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {    

    this.loadingService.showPageLoading();

    this.translate.use('en');

    this.storageService.get("DotsUserData").then((userData) =>{

      console.log(userData);

      if(userData != null){
        this.router.navigate(['/home']);
      }

      this.loadingService.hidePageLoading();
      
    });


  }

  ionViewWillEnter() {

    this.menuController.enable(false);
  }
  
  public signInWithFB() {
    this.authService.authState.subscribe((user) => {
      this.fbUser = user;
      this.fbLoggedIn = (user != null);
      console.log("***Signed in with fb ", this.fbUser);

      this.localAuthService.handleFbUser(this.fbUser).subscribe(async (data: [any]) => {
        this.setStorageData(data["userData"]);
      },
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      });
    });

    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  public signOut() {
    this.authService.signOut();
  }

  public email = new FormControl('', Validators.compose([
    Validators.required,
    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  ]));

  public password = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(15)
  ]));

  public emailNotExistingError = false;
  public checkingEmail = false;

  async checkEmail(){
    if(this.checkingEmail == false){
      this.checkingEmail = true;

      console.log("***Checking if acc with this email exists");

      setTimeout(() => {
        this.localAuthService.checkEmail(this.email.value).subscribe( async (data: [any]) => {
          if(data["matchingEmails"] == 1) this.emailNotExistingError = false;
          else this.emailNotExistingError = true;
          this.checkingEmail = false;
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        });
      }, 2000);
    }
  }

  async setStorageData(user){
    
    let alert = await this.alertController.create({
      header: this.translate.instant("LoggingIn")
    })

    await alert.present();

    
    if(user["Lang"] != null){
      this.translate.setDefaultLang(user["Lang"]);
    }

    console.log("***Logged in as ", user);

    this.userService.data = user;
    this.storageService.set("DotsUserData", user).then(() =>{
      
        alert.dismiss();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 200);
    })
    
  }

  async login(){

    let data = {
      email: this.email.value,
      password: this.password.value
    }

    this.localAuthService.login(data).subscribe( async (data: [any]) => {

      if(data["userData"] != null){
        this.setStorageData(data["userData"]);
      }
      else{
        let alert = await this.alertController.create({
          header: this.translate.instant("WrongPassword"),
          message: "<a href='/forgottenPassword'>" + this.translate.instant("ForgottenPassword") + "</a>"
        })

        await alert.present();
      }
    },
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    });
  }

}
