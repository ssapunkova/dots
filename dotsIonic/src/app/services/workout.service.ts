import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  public userId;

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public userService: UserService
  ) { }


  public getWorkoutSheetData(sheetId){
    return this.http.get(this.connectToServerService.serverUrl + '/getSheetData/one/' + sheetId)
  }

  public getWorkoutSheetsData(userId){
    return this.http.get(this.connectToServerService.serverUrl + '/getSheetData/all/' + userId)
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

  public updateSheet(sheetData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateSheet',
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
