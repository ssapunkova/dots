import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { LoadingService } from './loading.service';
import { ParamsService } from './params.service';

@Injectable({
  providedIn: 'root'
})
export class VitalsService {


  public data = {
    general: [],
    records: []
  };

  public Params = [];

  constructor(
      public http: HttpClient,
      public connectToServerService: ConnectToServerService,
      public loadingService: LoadingService,
      public paramsService: ParamsService
  ) {

    this.Params = this.paramsService.vitals;

  }

  public getVitalsData(userId){
    return this.http.get(this.connectToServerService.serverUrl + '/getVitalsData/' + userId)
  }

  public updateVitalsParams(data, userId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateVitalsParams',
      { data: data, userId: userId }
    )
  }

  public addRecord(recordData){
    console.log(recordData);
    return this.http.post(
      this.connectToServerService.serverUrl + '/addVitalsRecord',
      { data: recordData }
    );
  }

  public editRecord(recordData){
    return this.http.post(
      this.connectToServerService.serverUrl + '/editVitalsRecord',
      {data: recordData}
    );
  }

  public deleteRecord(recordId){
    return this.http.post(
      this.connectToServerService.serverUrl + '/deleteVitalsRecord',
      {recordId: recordId}
    );
  }

}
