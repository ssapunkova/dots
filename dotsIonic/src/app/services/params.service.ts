import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {


  public nutrition = [
    {
      Index: 0,
      Title: "kcal",
      Goal: 2000,
      Unit: "kcal"
    },
    {
      Index: 1,
      Title: "bodyFatPercentage",
      Goal: 20,
      Unit: "%"
    },
    {
      Index: 2,
      Title: "daylyProteinIntake",
      Goal: 85,
      Unit: "g"
    },
    {
      Index: 3,
      Title: "blocks",
      Goal: 12,
      Unit: "blocks"
    },
    {
      Index: 4,
      Title: "sugar",
      Goal: 40,
      Unit: "gr"
    }
  ]

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

}
