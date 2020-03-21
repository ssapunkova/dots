import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public finishRegistrationMode = false;

  public tokenId = this.route.snapshot.paramMap.get("tokenId");
  
  public email = new FormControl('', Validators.compose([
    Validators.required,
    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  ]));

  public finishForm = new FormGroup({
    username: new FormControl('', Validators.compose([
      Validators.required
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required
    ]))
 });

  constructor(
    private route: ActivatedRoute,
    private menuController: MenuController,
    public loadingService: LoadingService,
    public alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {

    if(this.tokenId != null) this.finishRegistrationMode = true;
    
    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  async sendEmail(){

    let email = this.email.value;

    let alert = await this.alertController.create({
      'message': "Sent an email to " + email,
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

  }

}
