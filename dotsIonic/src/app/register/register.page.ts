import { Component, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private menuController: MenuController,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.hidePageLoading();
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

}
