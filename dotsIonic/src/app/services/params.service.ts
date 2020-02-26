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

  public bodyMassConstants = [];

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    console.log("get")
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

  async getBodyMassConstants(gender){
    

    if(this.bodyMassConstants.length == 0){
      console.log("***************");
      this.bodyMassConstants = [5];
      this.getConstants(gender).subscribe(async (data: any) => {
        console.log(gender);
        console.log(data);
        this.bodyMassConstants = data;
      });
      
      return "a";
    }
    else{
      console.log("-")
      
      return "a";
    }

  }
}
