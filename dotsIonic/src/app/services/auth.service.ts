import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { LoadingController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

// Auth Service
// Implements authorisation and registration functions

@Injectable()
export class AuthService{

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public loadingController: LoadingController,
    private translate: TranslateService
  ) { }

  public sendRegistrationEmail(email, name){
    console.log(email, name)

    return this.http.post(this.connectToServerService.serverUrl + '/sendRegistrationEmail',
      { 
        email: email,
        name: name,
        emailContent: {
          subject: this.translate.instant("registerEmailContent.subject"),
          appUrl: this.connectToServerService.appUrl,
          linkText: this.translate.instant("registerEmailContent.text")
        }
      } 
    )
  }

}
