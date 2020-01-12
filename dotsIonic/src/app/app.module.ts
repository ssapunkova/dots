import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Services
import { ConnectToServerService } from './services/connectToServer.service';
import { LoadingService } from './services/loading.service';
import { ErrorToastAndAlertService } from './services/errorToastAndAlert.service';
import { DataTableService } from './services/dataTable.service';
import { TimeAndDateService } from './services/timeAndDate.service';
import { TimerService } from './services/timer.service';
import { ChartService } from './services/chart.service';
import { WorkoutService } from './services/workout.service';
import { StorageService } from './services/storage.service';

import { SheetConfigurationPage } from './workouts/sheetConfiguration/sheetConfiguration.page';
import { NewWorkoutRecordPage } from './workoutSheet/newWorkoutRecord/newWorkoutRecord.page';
import { NewNutritionRecordPage } from './nutrition/newNutritionRecord/newNutritionRecord.page';

@NgModule({
  declarations: [
    AppComponent,
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage
  ],
  entryComponents: [
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    StatusBar,
    ConnectToServerService,
    LoadingService,
    ErrorToastAndAlertService,
    DataTableService,
    TimeAndDateService,
    TimerService,
    ChartService,
    WorkoutService,
    StorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  exports: [
    NgxChartsModule,
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
