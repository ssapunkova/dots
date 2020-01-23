import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {


  public data = {
    general: [],
    records: []
  };


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
      public loadingService: LoadingService,
  ) { }


    async loadData(){

      this.data = {
        general: [],
        records: []
      };

      this.http.get(this.connectToServerService.serverUrl + '/getNutritionData').subscribe(async (data: any) => {

        // If no custom params - take default
        if(data.general.Params.length == 0){
          data.general.Params = this.DefaultParams;
        }
        else{
          for(var i = 0; i < data.general.Params.length; i++){
            data.general.Params[i] = this.Params[data.general.Params[i]];
          }
        }

        // Get goals - combine custom and default goals

          for(var i = 0; i < data.general.Params.length; i++){
            if(data.general.Goals[i] == null){
               data.general.Goals[i] = this.Params[data.general.Params[i].Index].Goal;
            }
          }

        // Dismiss all loading

        this.data = data;
        this.loadingService.isPageLoading = false;
        await this.loadingService.dismissSmallLoading();

        console.log(this);

        return this.data;

      });
    };

  // public getNutritionData(){
  //   return this.http.get(this.connectToServerService.serverUrl + '/getNutritionData')
  // }

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
