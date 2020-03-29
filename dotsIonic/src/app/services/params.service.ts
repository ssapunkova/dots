import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  public allParams = [
    {
      Index: 0,
      Title: "gender",
      Options: [
        { "Title": "Male", "Value": 0 },
        { "Title": "Female", "Value": 1 },                 // 0 - gender  
      ],
      Type: "select"
    },
    {
      Index: 1,
      Title: "age",
      Unit: "y.o.",                                        // 1 - age
      Type: "number"
    },
    {
      Index: 2,
      Title: "weight",
      Unit: "kg",                                          // 2 - weight
      Type: "number"
    },
    {
      Index: 3,
      Title: "height",
      Unit: "cm",                                          // 3 - height
      Type: "number"
    },
    {
      Index: 4,
      Title: "waist",
      Unit: "cm",                                          // 4 - waist
      Type: "number"
    },
    {
      Index: 5,
      Title: "wrist",
      Unit: "cm",                                          // 5 - waist
      Type: "number"
    },
    {
      Index: 6,
      Title: "hips",
      Unit: "cm",                                          // 6 - hips
      Type: "number"
    },
    {
      Index: 7,
      Title: "activityFactorZone",
      Options: [
        { "Title": "seditary", "Value": 0.5 },
        { "Title": "light", "Value": 0.6 },    
        { "Title": "workout3TimesAWeek", "Value": 0.7 },   // 7 - activity factor for Zone calculations
        { "Title": "lightWorkoutEveryDay", "Value": 0.8 },
        { "Title": "heavyWorkoutEveryDay", "Value": 0.9 },
        { "Title": "professional", "Value": 1 }
      ],
      Type: "select"
    },
    {
      Index: 8,
      Title: "activityFactorKcal",
      Options: [
        { "Title": "low", "Value": 1.2 },
        { "Title": "average", "Value": 1.3 },              // 8 - activity factor for kcal calculations
        { "Title": "heavy", "Value": 1.4 },   
      ],
      Type: "select"
    },
    {
      Index: 9,
      Title: "kcal",
      Unit: "kcal",                                        // 9 - kcal intake
      Goal: 2000,
      Type: "number"
    },
    {
      Index: 10,
      Title: "bodyFatPercentage",                          
      Goal: 20,                                            // 10 - body fat percentage
      Unit: "%",
      Type: "number"
    },
    {
      Index: 11,
      Title: "daylyProteinIntake",
      Goal: 85,                                            // 11 - dayly protein intake in gr
      Unit: "g",
      Type: "number"
    },
    {
      Index: 12,
      Title: "blocks",
      Goal: 12,                                            // 12 - zone blocks
      Unit: "blocks",
      Type: "number"
    },
    {
      Index: 13,
      Title: "sugar",
      Goal: 40,                                            // 13 - dayly sugar intake in gr
      Unit: "gr",
      Type: "number"
    }
  ]

  public categories = [
    {
      Title: "Nutrition",
      Id: "nutrition"
    }
  ]

  public general = [
    this.allParams[0],
    this.allParams[1]
  ]

  public nutrition = [
    this.allParams[9],
    this.allParams[10],
    this.allParams[11],
    this.allParams[12],
    this.allParams[13]
  ]

  constructor(
    public http: HttpClient,
    public userService: UserService,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

  public getUserParams(){
    let userId = this.userService.data._id;
    return this.http.get(this.connectToServerService.serverUrl + '/getUserParams/' + userId)
  }

  public updateUserParams(data){
    let userId = this.userService.data._id;
    console.log(userId);
    return this.http.post(
      this.connectToServerService.serverUrl + '/updateUserParams',
      { 
        userId: userId,
        data: data
      }
    );
  }

}
