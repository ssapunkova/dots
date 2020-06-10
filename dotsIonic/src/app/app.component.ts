import { Component, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from './services/loading.service';
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
    }
  ];

  public userData;

  constructor(
    public router: Router,
    private platform: Platform,
    private translate: TranslateService,
    public loadingService: LoadingService,
    private statusBar: StatusBar,
    private storageService: StorageService,
    public userService: UserService
  ) {

    
    this.storageService.get("DotsUserData").then((data) => {
      console.log("Storage service app.component ", data);
      if(data == null){  
        console.log("data is null")
        // If not logged, navigate to login
        this.router.navigate(['/login']);
      }
      else{
        // Set user data in userService
        this.userData = data;
        this.initializeApp();
      }
    })

  }

  async initializeApp() {
    this.translate.addLangs(['en', 'bg']);

    this.translate.setDefaultLang('en');

    if(this.userData != null){

      console.log("Not null");

      if(this.userData["Lang"] != 'en'){
        this.translate.setDefaultLang(this.userData["Lang"]);
      }

    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    
  };

  public logout(){
    console.log("***Logout");
    
    this.userData = null;
    
    this.storageService.set("DotsUserData", null).then(() => {
      console.log("Storage app.component -> logout ", this.storageService.get("DotsUserData"));

      this.router.navigate(['/login']);
    })

  }

}
