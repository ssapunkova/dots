import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public Params = [
    {
      index: 0,
      Title: "kcal",
      Goal: 2000
    },
    {
      index: 1,
      Title: "Blocks",
      Goal: 12
    },
    {
      index: 2,
      Title: "Sugar",
      Goal: 40
    },
    {
      index: 3,
      Title: "Protein (gr)",
      Goal: 85
    }
  ]


  public DefaultParams = [this.Params[0]];

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
  ) { }

  public getNutritionData(){
    return this.http.get(this.connectToServerService.serverUrl + '/getNutritionData')
  }


  public addRecord(recordData){
    console.log(recordData);
    return this.http.post(
      this.connectToServerService.serverUrl + '/addNutritionRecord',
      {data: recordData}
    );
  }

  public editRecord(recordData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/editNutritionRecord',
      {data: recordData}
    );
  }

  public deleteRecord(RecordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteNutritionRecord',
      {RecordId: RecordId}
    );
  }

}
