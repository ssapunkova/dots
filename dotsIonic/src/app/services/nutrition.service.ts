import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public Structure = [
    {
      index: 0,
      Title: "kcal",
      Goal: 2000,
      Type: "Number"
    },
    {
      index: 1,
      Title: "Blocks",
      Goal: 12,
      Type: "Number"
    },
    {
      index: 2,
      Title: "Sugar",
      Goal: 40,
      Type: "Number"
    },
    {
      index: 3,
      Title: "Protein (gr)",
      Goal: 85,
      Type: "Number"
    }
  ]

  public Goals = [
    {
      index: 0,
      Title: "Weight (kg)"
    },
    {
      index: 1,
      Title: "Lean body mass"
    }
  ]

  public DefaultStructure = [this.Structure[0]];
  public DefaultGoals = [this.Goals[0]];

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

  public deleteRecord(recordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteNutritionRecord',
      {recordId: recordId}
    );
  }

}
