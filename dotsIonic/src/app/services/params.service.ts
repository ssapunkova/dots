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
  public currentValue = [];

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

  async getConstantsArray(gender){
    console.log("***************");
    let array = [];
    this.getConstants(gender).subscribe(async (data: any) => {
      console.log(data);
      array = data;
    });
    console.log(array);
    return array;
  }

  async getBodyMassConstants(gender, values){
    

    // if(this.bodyMassConstants.length == 0){
      this.bodyMassConstants = await this.getConstantsArray(gender);
    // }
    
    console.log(values);
      console.log(this.bodyMassConstants);
      if(gender == "F"){
        this.currentValue = this.bodyMassConstants.filter((record) => record.Hips == values.hips)[0];
      }
      console.log(this.currentValue);
      return this.currentValue;  

  }
}
