import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

// Services
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirmRegistration.page.html',
  styleUrls: ['./confirmRegistration.page.scss'],
})
export class ConfirmRegistrationPage implements OnInit {

  public password;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  async finishRegistration(){

    let data = {
      tokenId: this.route.snapshot.paramMap.get("tokenId"),
      password: this.password
    }
    console.log("User data: ", data);

    this.authService.finishRegistration(data).subscribe( async (data: [any]) => {
      console.log(data);
    })

  }

}
