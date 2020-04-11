import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

// Services
import { ParamsService } from '../services/params.service';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { CalculatorPage } from './calculator/calculator.page';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Agent } from 'http';

@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {

 
  public userData;

  public dbData;

  
  constructor(
    public paramsService: ParamsService,
    public userService: UserService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private alertController: AlertController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;

    // Get user data from db

    this.paramsService.getUserParams(this.userData._id).subscribe( async (userParams) => {

      this.dbData = userParams;

      

    })

    this.loadingService.hidePageLoading();

  }


}
