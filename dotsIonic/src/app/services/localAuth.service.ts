import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { LoadingController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

// Auth Service
// Implements authorisation and registration functions

@Injectable()
export class LocalAuthService{

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public loadingController: LoadingController,
    private translate: TranslateService
  ) { }

  public checkEmail(email){
    return this.http.post(this.connectToServerService.serverUrl + '/checkEmail',
      { email: email } 
    )
  }

  public checkToken(tokenId){
    return this.http.post(this.connectToServerService.serverUrl + '/checkToken',
      { tokenId: tokenId } 
    )
  }

  public sendRegistrationEmail(email){
    console.log(email)

    return this.http.post(this.connectToServerService.serverUrl + '/sendRegistrationEmail',
      { 
        email: email,
        emailContent: {
          subject: this.translate.instant("registerEmailContent.subject"),
          appUrl: this.connectToServerService.appUrl,
          linkText: this.translate.instant("registerEmailContent.text")
        }
      } 
    )
  }

  public finishRegistration(data){
    console.log("Activating Token id: " + data.tokenId);

    return this.http.post(this.connectToServerService.serverUrl + '/finishRegistration',
      { data } 
    )
  }

  public comparePasswords(pass1, pass2){
    console.log(pass1, pass2);
    return this.http.post(this.connectToServerService.serverUrl + '/comparePasswords',
      { pass1: pass1, pass2: pass2 } 
    )
  }

  public login(data){
    return this.http.post(this.connectToServerService.serverUrl + '/login',
      { userData: data } 
    )
  }

  public handleFbUser(data){
    return this.http.post(this.connectToServerService.serverUrl + '/handleFbUser',
      { userData: data } 
    )
  }

}
