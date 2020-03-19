import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public userForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
    ])),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ]))
 });

  constructor(
    private menuController: MenuController,
    public loadingService: LoadingService,
    public alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  async sendEmail(){

    let email = this.userForm.value.email;
    let name = this.userForm.value.name;

    let alert = await this.alertController.create({
      'message': "Sent an email to " + email,
      'buttons': [
        {
          'text': "Ok"
        }
      ]
    })
    await alert.present();

    console.log(this.userForm.value);
    console.log("***Sending email to " + email);

    this.authService.sendRegistrationEmail(email, name).subscribe( async (data: [any]) => {
      console.log(data);
    })
  }

}
