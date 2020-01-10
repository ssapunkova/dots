import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public Structure = [
    {
      Title: "kcal",
      Goal: 2000,
      Type: "Number"
    },
    {
      Title: "Blocks",
      Goal: 12,
      Type: "Number"
    },
    {
      Title: "Sugar",
      Goal: 40,
      Type: "Number"
    },
    {
      Title: "Protein (gr)",
      Goal: 85,
      Type: "Number"
    }
  ]

  public Goals = [
    "Weight",
    "Lean body mass",
    "Fat %"
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
