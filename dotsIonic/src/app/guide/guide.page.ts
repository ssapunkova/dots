import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class GuidePage implements OnInit {

  public userData;
  
  @ViewChild('slider', { static: false }) slider: IonSlides;

  sliderObj: any;

  //Configuration for each Slider
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };

  constructor(
    public userService: UserService,
    public translate: TranslateService,
    public loadingService: LoadingService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    console.log(this.slider);

    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;
    console.log("***UserData", this.userData);

    this.sliderObj = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
          {
            id: 1
          },
          {
            id: 2
          },
          {
            id: 3
          },
          {
            id: 4
          },
          {
            id: 5
          }
      ]
    }

    this.loadingService.hidePageLoading();
  }

  async setLanguage(){
    this.translate.use(this.userData.Lang);
    
    this.storageService.set("DotsUserData.Lang", this.userData.Lang);
    console.log(this.storageService.get("DotsUserData"));
  }

  async saveUserData(){

    console.log(this.userData);
   
    if(this.userData.Username != null 
      && this.userData.Age > 0 
      && this.userData.Age < 100
      && this.userData.Gender != null){

        this.userService.updateUserData(this.userData).subscribe( async (data: [any]) => {
          console.log(data);
        });

        this.router.navigate(['/home']);
    }
    else{
      this.errorToastAndAlertService.showErrorToast(this.translate.instant("EnterGeneralInfo"));
    }

  }

}
