import { Component, OnInit } from '@angular/core';

import { LoadingService } from '../services/loading.service';
import { DataTableService } from '../services/dataTable.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { NutritionService } from '../services/nutrition.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  public showMode = 'table';

  public nutritionData = {
    Structure: [],
    Goals: []
  }

  constructor(
    public loadingService: LoadingService,
    public timeAndDateService: TimeAndDateService,
    public dataTableService: DataTableService,
    public nutritionService: NutritionService
  ) { }

  ngOnInit() {
    this.loadingService.isPageLoading = false;

    this.getNutritionData();
  }

  async getNutritionData(){

    this.nutritionService.getNutritionData().subscribe((data: [any])=> {

      console.log(data);
      this.nutritionData = data;
    });

  }

}
