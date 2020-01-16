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

  public getExerciseTimes(sheetId){
    return this.http.get(this.connectToServerService.serverUrl + '/getExerciseTimes/' + sheetId)
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
      {SheetId: sheetId}
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

  public deleteRecord(RecordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteWorkoutRecord',
      {RecordId: RecordId}
    );
  }

  public updateSheetConfiguration(sheetData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateSheetConfiguration',
      {data: sheetData}
    );
  }

}
