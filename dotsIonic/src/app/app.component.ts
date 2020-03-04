import { Component, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from './services/loading.service';
import { ErrorToastAndAlertService } from './services/errorToastAndAlert.service';
import { DataTableService } from './services/dataTable.service';
import { TimeAndDateService } from './services/timeAndDate.service';
import { ChartService } from './services/chart.service';
import { WorkoutService } from './services/workout.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

@Injectable()
export class AppComponent {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home-outline',
      iconColor: 'primary'
    },
    {
      title: 'Workouts',
      url: '/workouts',
      icon: 'barbell',
      iconColor: 'secondary'
    },
    {
      title: 'Nutrition',
      url: '/nutrition',
      icon: 'nutrition-sharp',
      iconColor: 'tertiary'
    },
    {
      title: 'Parameters',
      url: '/params',
      icon: 'grid',
      iconColor: 'red'
    },
  ];


  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private dataTableService: DataTableService,
    private timeAndDateService: TimeAndDateService,
    private chartService: ChartService,
    private workoutService: WorkoutService,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    translate.addLangs(['en', 'bg']);
    translate.setDefaultLang('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  };

}
