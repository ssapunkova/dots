import { Injectable } from '@angular/core';

import { Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { ConnectToServerService } from './connectToServer.service';

@Injectable()
export class UserService implements Resolve<Observable<string>> {

  public data;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private connectToServerService: ConnectToServerService,
    private router: Router
  ) { }

  resolve() {

    this.data = this.storageService.get("DotsUserData");
    console.log("RESOLVE ", this.data);
    return this.data;
  
  }

  public updateUserData(newData){
    console.log(newData);
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateUserData',
      {data: newData}
    );
  }

}
