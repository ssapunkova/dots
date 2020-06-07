import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectToServerService } from './connectToServer.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  public allParams = [
    {
      Index: 0,
      Title: "Gender",
      Options: [
        { "Title": "Male", "Value": 0 },
        { "Title": "Female", "Value": 1 },                 // 0 - gender  
      ],
      Type: "select",
    },
    {
      Index: 1,
      Title: "Age",
      Unit: "y.o.",                                        // 1 - age
      Type: "number",
    },
    {
      Index: 2,
      Title: "Weight",
      Unit: "kg",                                          // 2 - weight
      Type: "number",
      Icon: "heart"
    },
    {
      Index: 3,
      Title: "Height",
      Unit: "cm",                                          // 3 - height
      Type: "number",
      Icon: "heart"
    },
    {
      Index: 4,
      Title: "Waist",
      Unit: "cm",                                          // 4 - waist
      Type: "number",
      Icon: "heart"
    },
    {
      Index: 5,
      Title: "Wrist",
      Unit: "cm",                                          // 5 - waist
      Type: "number",
    },
    {
      Index: 6,
      Title: "Hips",
      Unit: "cm",                                          // 6 - hips
      Type: "number",
      Icon: "heart"
    },
    {
      Index: 7,
      Title: "ActivityFactorZone",
      Options: [
        { "Title": "seditary", "Value": 0.5 },
        { "Title": "light", "Value": 0.6 },    
        { "Title": "workout3TimesAWeek", "Value": 0.7 },   // 7 - activity factor for Zone calculations
        { "Title": "lightWorkoutEveryDay", "Value": 0.8 },
        { "Title": "heavyWorkoutEveryDay", "Value": 0.9 },
        { "Title": "professional", "Value": 1 }
      ],
      Type: "select",
    },
    {
      Index: 8,
      Title: "ActivityFactorKcal",
      Options: [
        { "Title": "low", "Value": 1.2 },
        { "Title": "average", "Value": 1.3 },              // 8 - activity factor for DaylyKcalIntake calculations
        { "Title": "heavy", "Value": 1.4 },   
      ],
      Type: "select",
    },
    {
      Index: 9,
      Title: "DaylyKcalIntake",
      Unit: "kcal",                                        // 9 - DaylyKcalIntake intake
      Goal: 2000,
      Type: "number",
      Color: 1,
      Icon: "vitals"
    },
    {
      Index: 10,
      Title: "BodyFatPercentage",                          
      Goal: 20,                                            // 10 - body fat percentage
      Unit: "%",
      Type: "number",
      Color: 7,
      Icon: "vitals"
    },
    {
      Index: 11,
      Title: "DaylyProteinIntake",
      Goal: 85,                                            // 11 - dayly protein intake in gr
      Unit: "g",
      Type: "number",
      Color: 3,
      Icon: "vitals"
    },
    {
      Index: 12,
      Title: "Blocks",
      Goal: 12,                                            // 12 - zone blocks
      Unit: "bl",
      Type: "number",
      Color: 5,
      Icon: "vitals"
    },
    {
      Index: 13,
      Title: "DaylySugarIntake",
      Goal: 40,                                            // 13 - dayly sugar intake in gr
      Unit: "gr",
      Type: "number",
      Color: 2,
      Icon: "vitals"
    }
  ]

  public categories = [
    {
      Title: "Vitals",
      Id: "vitals"
    }
  ]

  public general = [
    this.allParams[0],
    this.allParams[1]
  ]

  public vitals = [
    this.allParams[2],
    this.allParams[3],
    this.allParams[4],
    this.allParams[6],
    this.allParams[9],
    this.allParams[10],
    this.allParams[11],
    this.allParams[12],
    this.allParams[13]
  ]

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
  ) { }

  public getConstants(gender){
    return this.http.get(this.connectToServerService.serverUrl + '/getBodyMassConstants/' + gender)
  }

  public getUserParams(userId){
    return this.http.get(this.connectToServerService.serverUrl + '/getUserParams/' + userId)
  }

  public updateUserParams(userId, data){
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
