import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public finishRegistrationMode = false;

  public tokenId = this.route.snapshot.paramMap.get("tokenId");
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuController: MenuController,
    public loadingService: LoadingService,
    private translate: TranslateService,
    public alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    if(this.tokenId != null) this.finishRegistrationMode = true;
    
    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  public email = new FormControl('', Validators.compose([
    Validators.required,
    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  ]));

  public username = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(15),
    Validators.pattern(/^([a-zA-Z0-9_-])+$/)
  ]));


  public password = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(15)
  ]));

  public repeatPassword = new FormControl('', Validators.compose([
    Validators.required
  ]));

  public finishForm = this.formBuilder.group({
    username: this.username,
    password: this.password,
    repeatPassword: this.repeatPassword
 },
 {
   validator: this.checkPasswordsMatch
 });

 
 public checkPasswordsMatch(group: FormGroup) {
  let pass1 = group.controls.password.value;
  let pass2 = group.controls.repeatPassword.value;
  console.log(pass1, pass2);
  console.log(pass1 == pass2);
  return (pass1 == pass2) ? null : {'passwordMatch': false};
}

  async sendEmail(){

    let email = this.email.value;

    let alert = await this.alertController.create({
      'message': this.translate.instant("SentEmail") + email,
      'buttons': [
        {
          'text': "Ok"
        }
      ]
    })
    await alert.present();

    console.log(this.email);
    console.log("***Sending email to " + email);

    this.authService.sendRegistrationEmail(email).subscribe( async (data: [any]) => {
      console.log(data);
    })
  }

  async finishRegistration(){

    let data = {
      tokenId: this.route.snapshot.paramMap.get("tokenId"),
      username: this.finishForm.value.username,
      password: this.finishForm.value.password
    }
    console.log("User data: ", data);

    this.authService.finishRegistration(data).subscribe( async (data: [any]) => {
      console.log(data);
    })

    this.router.navigate(['/welcome'])

  }

}
