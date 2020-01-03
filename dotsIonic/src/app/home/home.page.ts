import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { LoadingService } from '../services/loading.service';
import { WorkoutService } from '../services/workout.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

@Injectable()
export class HomePage implements OnInit {

  constructor(
    public loadingService: LoadingService,
    public workoutService: WorkoutService
  ){}

  ngOnInit(){
    this.init();
  }

  async init(){

    this.loadingService.isPageLoading = false;
  }

  async test(){
    console.log("a");
    this.workoutService.createSheet().subscribe((data: [any])=> {
      console.log(data);
    })
  }
}
