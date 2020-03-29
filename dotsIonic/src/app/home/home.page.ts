import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
    private menuController: MenuController,
    private route: ActivatedRoute
  ){}

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  ngOnInit(){
    this.loadingService.showPageLoading();

    // Do something

    this.userData = this.route.snapshot.data.userData;

    this.loadingService.hidePageLoading();

  }

}
