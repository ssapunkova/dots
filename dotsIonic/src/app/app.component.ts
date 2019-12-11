import { Component, OnInit, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Services
import { LoadingService } from './loadingService/loading.service';
import { ToastService } from './toastService/toast.service';
import { DataTableService } from './dataTableService/dataTable.service';
import { TimeConverterService } from './timeConverterService/timeConverter.service';
import { ChartService } from './chartService/chart.service';

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
    private toastService: ToastService,
    private dataTableService: DataTableService,
    private timeConverterService: TimeConverterService,
    private chartService: ChartService,
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
