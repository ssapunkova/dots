import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { StorageService } from './storage.service';

@Injectable()
export class UserService implements Resolve<Observable<string>> {

  public data;

  constructor(
    private storageService: StorageService
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

  // resolve() {
  //       return Observable.of('Hello Alligator!').delay(2000);
  //     }



}

// import { Injectable } from '@angular/core';

// import { Resolve } from '@angular/router';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/delay';

// @Injectable()
// export class UserService implements Resolve<Observable<string>> {
//   constructor() {}

//   resolve() {
//     return Observable.of('Hello Alligator!').delay(2000);
//   }
// }
