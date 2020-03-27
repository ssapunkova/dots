import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  public userData;

  constructor(
    public loadingService: LoadingService,
    private translate: TranslateService,
    private router: Router,
    public storageService: StorageService
  ){}

  ngOnInit(){
    this.loadingService.showPageLoading();

    // Do something

    this.storageService.get("DotsUserData").then((data) => {
      if(data != null){
        this.userData = data;
        console.log(data);
      }
      else{
        this.router.navigate(['/home']);
      }

      this.loadingService.hidePageLoading();
    });

  }

}
