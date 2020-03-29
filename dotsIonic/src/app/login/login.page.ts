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
    private authService: AuthService
  ) { }

  ngOnInit() {    

    this.authService.authState.subscribe((user) => {
      this.fbUser = user;
      this.fbLoggedIn = (user != null);
      console.log("***Signed in with fb ", this.fbUser);

      this.localAuthService.handleFbUser(this.fbUser).subscribe(async (data: [any]) => {
        console.log(data["userData"]);
        
        this.setStorageData(data["userData"]);
      })
    });

    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
  
  public signInWithFB() {
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

      setTimeout(() => {
        this.localAuthService.checkEmail(this.email.value).subscribe( async (data: [any]) => {
          console.log(data["matchingEmails"]);

          if(data["matchingEmails"] == 1) this.emailNotExistingError = false;
          else this.emailNotExistingError = true;
          
          this.checkingEmail = false;
        })
      }, 2000);
    }
  }

  async setStorageData(user){
    console.log("***Logged in as ", user.Username);

    this.storageService.set("DotsUserData", user);

    this.userService.data = user;

    this.router.navigate(['/home']);
  }

  async login(){

    let data = {
      email: this.email.value,
      password: this.password.value
    }

    this.localAuthService.login(data).subscribe( async (data: [any]) => {
      console.log(data);

      if(data["userData"] != null){
        this.setStorageData(data["userData"]);
      }
    })
  }

}
