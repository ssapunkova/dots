import { Component, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from './services/loading.service';
import { ErrorToastAndAlertService } from './services/errorToastAndAlert.service';
import { DataTableService } from './services/dataTable.service';
import { TimeAndDateService } from './services/timeAndDate.service';
import { ChartService } from './services/chart.service';
import { WorkoutService } from './services/workout.service';
import { StorageService } from './services/storage.service';
import { UserService } from './services/user.service';


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
      title: 'Vitals',
      url: '/vitals',
      icon: 'heart-sharp',
      iconColor: 'red'
    },
    {
      title: 'Calculators',
      url: '/calculators',
      icon: 'calculator',
      iconColor: 'tertiary'
    },
    {
      title: 'Guide',
      url: '/guide',
      icon: 'settings-sharp',
      iconColor: 'medium'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings-sharp',
      iconColor: 'medium'
    },
  ];

  public userData;

  constructor(
    public router: Router,
    private platform: Platform,
    private translate: TranslateService,
    public loadingService: LoadingService,
    private statusBar: StatusBar,
    private storageService: StorageService,
    public userService: UserService,
    private route: ActivatedRoute
  ) {

    
    // if(this.userData == null){
    //   console.log("No user data")
    //   // Check if user has logged in
    //   this.storageService.get("DotsUserData").then((data) => {
    //     console.log("Storage service app.component ", data);
    //     if(data == "null"){  
    //       console.log("data is null")
    //       // If not logged, navigate to login
    //       this.router.navigate(['/login']);
    //     }
    //     else{
    //       // Set user data in userService
    //       this.userData = data;
    //       this.initializeApp();
    //     }
    //   })
    // }
    // else{
    //   console.log("User data  app.component ", this.userData)
    //   this.initializeApp();
    // }

    
    this.userData = this.route.snapshot.data.userData;

    this.initializeApp();

  }

  async initializeApp() {
    this.translate.addLangs(['en', 'bg']);

    this.translate.setDefaultLang('en');

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    
  };

  public logout(){
    console.log("***Logout");
    
    this.userData = null;
    
    this.storageService.set("DotsUserData", "null").then(() => {
      console.log("Storage app.component -> logout ", this.storageService.get("DotsUserData"));

      this.router.navigate(['/login']);
    })

  }

}
