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
      Goal: 2000
    },
    {
      Index: 1,
      Title: "BodyFatPercentage",
      Goal: 20
    },
    {
      Index: 2,
      Title: "DaylyProteinIntake",
      Goal: 85
    },
    {
      Index: 3,
      Title: "Blocks",
      Goal: 12
    },
    {
      Index: 4,
      Title: "Sugar",
      Goal: 40
    },
  ]

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

}
