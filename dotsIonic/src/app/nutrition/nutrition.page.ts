import { Component, OnInit } from '@angular/core';

import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  public showMode = 'table';

  constructor(
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.isPageLoading = false;

    this.getNutritionData();
  }

  async getNutritionData(){

    

  }

}
