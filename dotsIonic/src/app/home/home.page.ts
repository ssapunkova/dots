import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AnalyseService } from '../services/analyse.service';
import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  public userData;

  public workoutStats;

  public sliderOpts = {
    initialSlide: 1
  }

  constructor(
    public loadingService: LoadingService,
    private translate: TranslateService,
    private menuController: MenuController,
    private route: ActivatedRoute,
    private analyseService: AnalyseService,
    private workoutService: WorkoutService
  ){}

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  ngOnInit(){
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    console.log("USERDATA", this.userData)

    this.getWorkoutStats();
    
  }

  async getWorkoutStats(){
    
    
    this.workoutService.getWorkoutSheetsData(this.userData._id).subscribe( async (data: [any]) => {

      this.workoutStats = await this.analyseService.getWorkoutStats(data);

      console.log(data);

      console.log(this.workoutStats);

      this.loadingService.hidePageLoading();

    });

  }

}