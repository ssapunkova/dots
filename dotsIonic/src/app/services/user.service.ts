import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';

@Injectable()
export class UserService implements Resolve<Observable<string>> {

  public data;

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) { }

  resolve() {

    this.storageService.get("DotsUserData").then((data) => {
      console.log(data);
      if(data == null){  
        // If not logged, navigate to login
        this.router.navigate(['/login']);
      }
      else{
        // Set user data in userService
        console.log("setting ", data)
        this.data = data;
      }
    })
    
    return this.data;

  }
}
