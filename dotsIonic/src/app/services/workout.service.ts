import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
  ) { }

  public getWorkoutSheetData(sheetId){
    return this.http.get(this.connectToServerService.serverUrl + '/getSheetData/' + sheetId)
  }

  public getWorkoutSheetsData(){
    return this.http.get(this.connectToServerService.serverUrl + '/getSheetData/all')
  }

  public getSheetExercises(sheetId){
    return this.http.get(this.connectToServerService.serverUrl + '/getSheetExercises/' + sheetId)
  }

  public createSheet(sheetData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/createSheet',
      {data: sheetData}
    );
  }

  public deleteSheet(sheetId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteSheet',
      {sheetId: sheetId}
    );
  }

  public addRecord(recordData){
    console.log(recordData);
    return this.http.post(
      this.connectToServerService.serverUrl + '/addWorkoutRecord',
      {data: recordData}
    );
  }

  public editRecord(recordData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/editWorkoutRecord',
      {data: recordData}
    );
  }

  public deleteRecord(recordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteWorkoutRecord',
      {recordId: recordId}
    );
  }

  public updateSheetConfiguration(sheetData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateSheetConfiguration',
      {data: sheetData}
    );
  }

}
