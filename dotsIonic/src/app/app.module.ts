import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ComponentsModule } from './components/components.module';

// Pages
import { NewNutritionRecordPage } from './nutrition/newNutritionRecord/newNutritionRecord.page';
import { NewWorkoutRecordPage } from './workoutSheet/newWorkoutRecord/newWorkoutRecord.page';
import { NewWorkoutSheetPage } from './workouts/newWorkoutSheet/newWorkoutSheet.page';

// Services
import { ConnectToServerService } from './services/connectToServer.service';
import { LoadingService } from './services/loading.service';
import { ErrorToastAndAlertService } from './services/errorToastAndAlert.service';
import { GeneralService } from './services/general.service';
import { DataTableService } from './services/dataTable.service';
import { TimeAndDateService } from './services/timeAndDate.service';
import { TimerService } from './services/timer.service';
import { ChartService } from './services/chart.service';
import { AnalyseService } from './services/analyse.service';
import { WorkoutService } from './services/workout.service';
import { StorageService } from './services/storage.service';
import { LocalAuthService } from './services/localAuth.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    NewNutritionRecordPage,
    NewWorkoutRecordPage,
    NewWorkoutSheetPage
  ],
  entryComponents: [
    NewNutritionRecordPage,
    NewWorkoutRecordPage,
    NewWorkoutSheetPage
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
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
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
    AnalyseService,
    StorageService,
    LocalAuthService,
    UserService,
    ComponentsModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  exports: [
    NgxChartsModule,
    ComponentsModule,
    TranslateModule,
    NewNutritionRecordPage,
    NewWorkoutRecordPage,
    NewWorkoutSheetPage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}