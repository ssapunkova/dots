import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AnalyseService } from '../services/analyse.service';
import { WorkoutService } from '../services/workout.service';
import { VitalsService } from '../services/vitals.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  public userData;

  public workoutStats;
  public vitalsStats;

  public showingMonths;

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
    private vitalsService: VitalsService
  ){}

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  ngOnInit(){
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    console.log("USERDATA", this.userData)


    Promise.all([this.getWorkoutStats(), this.getVitalsStats()])
    .then(() => {

      let a = this.workoutStats.MonthlyStats.Months;
      let b = this.vitalsStats.MonthlyStats.Months;
      if(a.length > b.length){
        this.showingMonths = b;
        this.showingMonths = [...a];
      }
      else{
        this.showingMonths = a;
        this.showingMonths = [...b];
      }

      // Show months in desc
      this.showingMonths.reverse();
      

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

  getVitalsStats = () => new Promise((resolve) => {
      
      
    this.vitalsService.getVitalsData(this.userData._id).subscribe( async (data: [any]) => {

      if(data["Records"].length > 0){

        this.vitalsStats = await this.analyseService.getVitalsStats(data);

        console.log(this.vitalsStats);

      }

      resolve(true);

    });

  });


}