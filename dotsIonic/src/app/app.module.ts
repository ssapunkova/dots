import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Services
import { ConnectToServerService } from './connectToServerService/connect.service';
import { LoadingService } from './loadingService/loading.service';
import { ToastService } from './toastService/toast.service';
import { DataTableService } from './dataTableService/dataTable.service';
import { TimeAndDateService } from './timeAndDateService/timeAndDate.service';
import { ChartService } from './chartService/chart.service';

import { SheetPopoverComponent } from './workouts/sheetPopover/sheetPopover.component';

import { SheetConfigurationPage } from './workouts/sheetConfiguration/sheetConfiguration.page';
import { NewWorkoutRecordPage } from './workoutSheet/newWorkoutRecord/newWorkoutRecord.page';

@NgModule({
  declarations: [
    AppComponent,
    SheetPopoverComponent,
    SheetConfigurationPage,
    NewWorkoutRecordPage
  ],
  entryComponents: [
    SheetPopoverComponent,
    SheetConfigurationPage,
    NewWorkoutRecordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
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
    ToastService,
    DataTableService,
    TimeAndDateService,
    ChartService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  exports: [
    SheetPopoverComponent,
    SheetConfigurationPage,
    NewWorkoutRecordPage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
