import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

// Services
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordVisible = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuController: MenuController,
    public loadingService: LoadingService,
    private translate: TranslateService,
    public alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public storageService: StorageService
  ) { }

  ngOnInit() {    
    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
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
        this.authService.checkEmail(this.email.value).subscribe( async (data: [any]) => {
          console.log(data["matchingEmails"]);

          if(data["matchingEmails"] == 1) this.emailNotExistingError = false;
          else this.emailNotExistingError = true;
          
          this.checkingEmail = false;
        })
      }, 2000);
    }
  }

  async login(){

    let data = {
      email: this.email.value,
      password: this.password.value
    }

    this.authService.login(data).subscribe( async (data: [any]) => {
      console.log(data);

      if(data["userData"] != null){
        let user = data["userData"];
        console.log("***Logged in as ", user);

        this.storageService.set("DotsUserData", user);

        this.router.navigate(['/home']);

      }
    })
  }

}
