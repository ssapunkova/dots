import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// Services
import { LoadingService } from '../services/loading.service';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AnalyseService } from '../services/analyse.service';
import { WorkoutService } from '../services/workout.service';
import { VitalsService } from '../services/vitals.service';

let monthNames;

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
  
  public colorScheme = { domain: [] }

  public sliderOpts = {
    initialSlide: 1
  }

  constructor(
    public loadingService: LoadingService,
    private translate: TranslateService,
    private menuController: MenuController,
    private route: ActivatedRoute,
    public router: Router,
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

    monthNames = [];

    for(let i = 0; i < 12; i++){
      monthNames.push(this.translate.instant('Month.' + i));
    }

    this.generateColorScheme();

    console.log(monthNames);


    Promise.all([this.getWorkoutStats(), this.getVitalsStats()])
    .then(() => {

      let w = [];
      let v = [];
      if(this.workoutStats != null){
        w = this.workoutStats.MonthlyStats.Months;
        this.showingMonths = w;
      }
      if(this.vitalsStats != null){
        v = this.vitalsStats.MonthlyStats.Months;
        this.showingMonths = v;
      }
      
      if(this.workoutStats != null && this.vitalsStats != null){
        if(w.length > v.length){
          this.showingMonths = v;
          this.showingMonths = [...w];
        }
        else{
          this.showingMonths = w;
          this.showingMonths = [...v];
        }
  
        // Show months in desc
        this.showingMonths.reverse();
      }

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

    console.log(this.translate.instant('a'));

  });


  async generateColorScheme(){
    let hue = 0;
    this.colorScheme.domain[0] = "#dddddd";
    for(let i = 1; i < 20; i++){
      this.colorScheme.domain.push("hsl(" + hue + ", 100%, 50%)");
      hue += 5;
    }

    console.log(this.colorScheme);
  }

  calendarAxisTickFormatting(mondayString) {
    let monday = new Date(mondayString);
    let month = monday.getMonth();
    let day = monday.getDate();
    return day > 12 && day < 20 ?  monthNames[month] : '';
  }

  calendarTooltipText(c) {
    return `
      <span class="tooltip-label">${c.cell.date.toLocaleDateString()}</span>
      <span class="tooltip-val">${c.data} </span>
    `;
  }


}