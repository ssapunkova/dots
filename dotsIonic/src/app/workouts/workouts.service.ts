import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from '../connectToServerService/connect.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
  ) { }

  public getWorkoutSheetsData(){
    return this.http.get(this.connectToServerService.serverUrl + '/getAllWorkoutRecords')
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

  public updateSheetConfiguration(sheetData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateSheetConfiguration',
      {data: sheetData}
    );
  }

  public addRecord(recordData){
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

}
