import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AnalyseService } from '../services/analyse.service';
import { WorkoutService } from '../services/workout.service';
import { NutritionService } from '../services/nutrition.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  public userData;

  public workoutStats;
  public nutritionStats;

  public sliderOpts = {
    initialSlide: 1
  }

  constructor(
    public loadingService: LoadingService,
    private translate: TranslateService,
    private menuController: MenuController,
    private route: ActivatedRoute,
    private analyseService: AnalyseService,
    private workoutService: WorkoutService,
    private nutritionService: NutritionService
  ){}

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  ngOnInit(){
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    console.log("USERDATA", this.userData)


    Promise.all([this.getWorkoutStats(), this.getNutritionStats()])
    .then(() => {
      this.loadingService.hidePageLoading();
    });

    
  }

  getWorkoutStats = () => new Promise((resolve) => {
    
    this.workoutService.getWorkoutSheetsData(this.userData._id).subscribe( async (data: [any]) => {

      
      if(data.length > 0){

        this.workoutStats = await this.analyseService.getWorkoutStats(data);


        console.log(this.workoutStats);

      }

      
      resolve(true);

    });

  });

  getNutritionStats = () => new Promise((resolve) => {
      
      
    this.nutritionService.getNutritionData(this.userData._id).subscribe( async (data: [any]) => {

      if(data["Records"].length > 0){

        this.nutritionStats = await this.analyseService.getNutritionStats(data);

        console.log(this.nutritionStats);

      }

      resolve(true);

    });

  });


}