import { Injectable } from '@angular/core';

import { Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { StorageService } from './storage.service';

@Injectable()
export class UserService implements Resolve<Observable<string>> {

  public data;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  resolve() {

    return this.storageService.get("DotsUserData");
  
  }

}
