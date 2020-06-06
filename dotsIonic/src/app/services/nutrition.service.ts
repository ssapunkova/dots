import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { LoadingService } from '../services/loading.service';
import { ParamsService } from '../services/params.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {


  public data = {
    general: [],
    records: []
  };

  public Params = [];
  public userCalculatedValues;

  public DefaultParams;
  public DefaultParamsIndex;

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
      public loadingService: LoadingService,
      public paramsService: ParamsService
  ) {

    this.Params = this.paramsService.nutrition;
    this.DefaultParamsIndex = 0;
    this.DefaultParams = [this.Params[0]];

  }

  public getNutritionData(userId){
    return this.http.get(this.connectToServerService.serverUrl + '/getNutritionData/' + userId)
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

  public deleteRecord(recordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteNutritionRecord',
      {recordId: recordId}
    );
  }

}
