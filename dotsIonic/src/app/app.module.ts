import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { ComponentsModule } from './components/components.module';

// Services
import { ConnectToServerService } from './services/connectToServer.service';
import { LoadingService } from './services/loading.service';
import { ErrorToastAndAlertService } from './services/errorToastAndAlert.service';
import { GeneralService } from './services/general.service';
import { DataTableService } from './services/dataTable.service';
import { TimeAndDateService } from './services/timeAndDate.service';
import { TimerService } from './services/timer.service';
import { ChartService } from './services/chart.service';
import { WorkoutService } from './services/workout.service';
import { StorageService } from './services/storage.service';

import { SheetConfigurationPage } from './workoutSheet/sheetConfiguration/sheetConfiguration.page';
import { NewWorkoutRecordPage } from './workoutSheet/newWorkoutRecord/newWorkoutRecord.page';
import { NewNutritionRecordPage } from './nutrition/newNutritionRecord/newNutritionRecord.page';
import { EditNutritionGoalsPage } from './nutrition/editNutritionGoals/editNutritionGoals.page';

@NgModule({
  declarations: [
    AppComponent,
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage,
    EditNutritionGoalsPage
  ],
  entryComponents: [
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage,
    EditNutritionGoalsPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
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
    GeneralService,
    ErrorToastAndAlertService,
    DataTableService,
    TimeAndDateService,
    TimerService,
    ChartService,
    WorkoutService,
    StorageService,
    ComponentsModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  exports: [
    NgxChartsModule,
    SheetConfigurationPage,
    NewWorkoutRecordPage,
    NewNutritionRecordPage,
    EditNutritionGoalsPage,
    ComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
