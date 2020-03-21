import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

// Services
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirmRegistration.page.html',
  styleUrls: ['./confirmRegistration.page.scss'],
})
export class ConfirmRegistrationPage implements OnInit {

  public password;

  public userForm = new FormGroup({
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadingService.hidePageLoading();
  }
  
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  async finishRegistration(){

    let data = {
      tokenId: this.route.snapshot.paramMap.get("tokenId"),
      username: this.userForm.value.username,
      password: this.userForm.value.password
    }
    console.log("User data: ", data);

    this.authService.finishRegistration(data).subscribe( async (data: [any]) => {
      console.log(data);
    })

  }

}
