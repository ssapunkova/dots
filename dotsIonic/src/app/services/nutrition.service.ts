import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public Params = [
    {
      Index: 0,
      Title: "kcal",
      Goal: 2000
    },
    {
      Index: 1,
      Title: "Blocks",
      Goal: 12
    },
    {
      Index: 2,
      Title: "Sugar",
      Goal: 40
    },
    {
      Index: 3,
      Title: "Protein (gr)",
      Goal: 85
    }
  ]


  public DefaultParamIndexes = [0];

  public DefaultParams = [this.Params[0]];

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
  ) { }

  public getNutritionData(){
    return this.http.get(this.connectToServerService.serverUrl + '/getNutritionData')
  }

  public updateNutritionParams(data){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateNutritionParams',
      {data: data}
    )
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
