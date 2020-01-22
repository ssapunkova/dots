import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  constructor(
    public loadingService: LoadingService
  ){}

  ngOnInit(){
    this.loadingService.isPageLoading = false;
  }

}
