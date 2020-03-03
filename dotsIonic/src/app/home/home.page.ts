import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  constructor(
    public loadingService: LoadingService,
    private translate: TranslateService
  ){}

  ngOnInit(){
    this.loadingService.showPageLoading();

    // Do something

    this.loadingService.hidePageLoading();
  }

}
