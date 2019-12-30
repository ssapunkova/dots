import { Component, OnInit, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Services
import { ConnectToServerService } from './services/connectToServer.service';
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
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Workouts',
      url: '/workouts',
      icon: 'workouts'
    }
  ];


  constructor(
    private platform: Platform,
    private loadingService: LoadingService,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private dataTableService: DataTableService,
    private timeAndDateService: TimeAndDateService,
    private chartService: ChartService,
    private workoutService: WorkoutService,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  };

}
