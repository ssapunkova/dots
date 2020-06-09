import { Injectable } from '@angular/core';

import { GeneralService } from './general.service';
import { VitalsService } from './vitals.service';
import { ParamsService } from './params.service';



// Analyse Service
// Analyses workout/vitals data from db

@Injectable()
export class AnalyseService{

  constructor(
    private generalService: GeneralService,
    private vitalsService: VitalsService,
    private paramsService: ParamsService
  ) {}


  async getWorkoutStats(data){

    let stats = {
      "Sheets": [],
      "OverallFrequency": 0,
      "Frequency": [],
      "StartAndNow": [],
      "MonthlyStats": {
        "Months": [],
        "Data": {}
      },
      "PeaksAndDowns": {
        "PeakPeriod": {},
        "DownPeriod": {}
      }
    };


    for(let i = 0; i < data.length; i++){
      console.log("Sheet", data[i]);

      stats.Sheets[i] = {
        Title: data[i].Title,
        Color: data[i].Color
      }
      
      let entries = data[i].WorkoutRecords.length;
      let firstRecord = data[i].WorkoutRecords[0];
      let lastRecord = data[i].WorkoutRecords[entries - 1];
      let weeks = this.generalService.countWeeks(firstRecord.Date, lastRecord.Date);

      console.log(weeks);

      // Frequency
      stats.Frequency[i] = entries / weeks;
      stats.OverallFrequency += stats.Frequency[i];

      // Monthly stats

      let months = [...this.generalService.getMonths(data[i].WorkoutRecords)];

      let monthlyData = {};
  
      let monthlyPercentageSum = [];
      let m = 0;

      for(let r = 0; r < data[i].WorkoutRecords.length; r++){
        let record = data[i].WorkoutRecords[r];
        let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
        if(monthlyData[splitDate] == null){
          monthlyData[splitDate] = {
            "Percentage": 0,
            "Records": 0,
            "Arrows": ["up", "up"]
          };
          
        }
        
        monthlyData[splitDate].Records++;
        let percentageSum = 0;
        for(let v = 0; v < record.Values.length; v++){
          percentageSum += this.generalService.calculatePercentage(record.Values[v], data[i].Params[v].Goal);
        }
        if(monthlyPercentageSum[splitDate] == null) monthlyPercentageSum[splitDate] = 0;
        monthlyPercentageSum[splitDate] += percentageSum /  data[i].Params.length;
        
      }

      for(let m = 0; m < months.length; m++){
        let month = months[m];
        monthlyData[month].Percentage = monthlyPercentageSum[month] / monthlyData[month].Records;
        
        // If there is a previous month, compare percentage and record number
        if(m > 1){
          if(monthlyData[months[m - 1]].Percentage > monthlyData[month].Percentage){
            monthlyData[month].Arrows[0] = "down";
          }
          if(monthlyData[months[m - 1]].Records > monthlyData[month].Records){
            monthlyData[month].Arrows[1] = "down";
          }
        }

      }

      stats.MonthlyStats.Months = months;
      stats.MonthlyStats.Data = monthlyData;

    }

    console.log(stats);

    return stats;

  }

  async getVitalsStats(data){
  
    console.log("Vitals data ", data);
    
    let stats = {
      "MonthlyStats": {
        "Months": [],
        "Data": {}
      },
      "PeaksAndDowns": {
        "PeakPeriod": {},
        "DownPeriod": {}
      },
      "StartAndNow": {
        "StartPercentage": 0, 
        "CurrentPercentage": 0, 
        "Diff": 0
      }
    };


    let entries = data.Records.length;
    let firstRecord = data.Records[0];
    let lastRecord = data.Records[entries - 1];
    let weeks = this.generalService.countWeeks(firstRecord.Date, lastRecord.Date);


    let analyseRecords = [firstRecord, lastRecord];
    let labels = ["StartPercentage", "CurrentPercentage"];

    // Start and now

    for(let e = 0; e < analyseRecords.length; e++){

      let record = analyseRecords[e];
      let sum = 0;
      let records = 0;
      for(let v = 0; v < record.Values.length; v++){
        if(record.Values[v] != null){
          let goal = data.Params[v].Goal;
          if(goal == null){
            goal = this.vitalsService.Params.filter((p) => p.Index == record.Params[v])[0].Goal;
          }
          sum += this.generalService.calculatePercentage(record.Values[v], goal);
          records++;
        }
      }
      
      stats.StartAndNow[labels[e]] += sum / records;

    }

    stats.StartAndNow.Diff = stats.StartAndNow.CurrentPercentage - stats.StartAndNow.StartPercentage;
    

    // Monthly stats

    let months = [...this.generalService.getMonths(data.Records)];

    let monthlyData = {};

    let monthlyPercentageSum = [];
    let m = 0;

    for(let r = 0; r < data.Records.length; r++){
      let record = data.Records[r];
      let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
      if(monthlyData[splitDate] == null){
        monthlyData[splitDate] = {
          "Percentage": 0,
          "Records": 0,
          "Arrows": "up"
        };
        
      }
      
      monthlyData[splitDate].Records++;
      let percentageSum = 0;
      let number = 0;
      for(let v = 0; v < record.Values.length; v++){
        console.log("v", v, ":", record.Values[v]);
        if(record.Values[v] != null){
          // Get user selected goal
          let goal =data.Goals[v];;
          // If no user goal, then default param goal
          if(goal == null){
            goal = this.paramsService.allParams[data.Params[v]].Goal;
          }
          percentageSum += this.generalService.calculatePercentage(record.Values[v], goal);
          number++;
        }
      }
      if(monthlyPercentageSum[splitDate] == null) monthlyPercentageSum[splitDate] = 0;
      console.log("r", r, ":", percentageSum, number);
      monthlyPercentageSum[splitDate] += percentageSum / number;
      
    }

    for(let m = 0; m < months.length; m++){
      let month = months[m];
      monthlyData[month].Percentage = monthlyPercentageSum[month] / monthlyData[month].Records;
      
      // If there is a previous month, compare percentage and record number
      if(m > 1){
        if(monthlyData[months[m - 1]].Percentage > monthlyData[month].Percentage){
          monthlyData[month].Arrows = "down";
        }
      }

    }

    stats.MonthlyStats.Months = months;
    stats.MonthlyStats.Data = monthlyData;


    console.log(stats);

    return stats;

  }

  // WorkoutPage: analyse each sheet
  async analyseWorkoutSheets(data){

    console.log(data);

    let stats = {
      "StartAndNow": []
    }

    for(let i = 0; i < data.length; i++){

      stats.StartAndNow[i] = {
        "StartPercentage": 0, 
        "CurrentPercentage": 0, 
        "Diff": 0
      }

      let entries = data[i].WorkoutRecords.length;
      let firstRecord = data[i].WorkoutRecords[0];
      let lastRecord = data[i].WorkoutRecords[entries - 1];

      let analyseRecords = [firstRecord, lastRecord];
      let labels = ["StartPercentage", "CurrentPercentage"];


      // Start and now

      for(let e = 0; e < analyseRecords.length; e++){

        let record = analyseRecords[e];
        let sum = 0;
        for(let v = 0; v < record.Values.length; v++){
          sum += this.generalService.calculatePercentage(record.Values[v], data[i].Params[v].Goal);
        }
        
        stats.StartAndNow[i][labels[e]] += sum / record.Values.length;

      }

      stats.StartAndNow[i].Diff = stats.StartAndNow[i].CurrentPercentage - stats.StartAndNow[i].StartPercentage;

    }

    console.log(stats);

    return stats;

  }

  async analyseWorkoutResults(data){
    
    console.log("***Analysing data ", data)

    let results = {
      "weeks": 0,
      "categories": ["aboveGoal", "nearGoal", "nowhereNearGoal"],
      "data": {
        "paramsToEdit": [],
        "needsNewGoal": [],
        "aboveGoal": [],
        "nearGoal": [],
        "nowhereNearGoal": []
      },
      "colors": {
        "aboveGoal": "warning", 
        "nearGoal": "success", 
        "nowhereNearGoal": "danger"
      },
      "icons": {
        "aboveGoal": "trending-up", 
        "nearGoal": "remove", 
        "nowhereNearGoal": "trending-down"
      }
    };

    let number = 5;
    if(data.Records.length < 5) number = data.Records.length;

    let goalsData = [];
    let registeredParams = [];

    for(let i = 0; i < number; i++){
      let currentRec = data.Records[i];
      for(let j = 0; j < currentRec.PercentageOfGoal.length; j++){
        let paramData = data.Params.filter((p) => p._id == currentRec.Params[j])[0];
                
        let index = registeredParams.indexOf(currentRec.Params[j]);
        if(index < 0){
          // Add param to goalsData array
          goalsData.push({
            Data: paramData,
            PercentageSum: currentRec.PercentageOfGoal[j],
            AveragePercentage: 0
          });
          registeredParams.push(currentRec.Params[j]);
        }
        else{
          // Increment result percentage sum 
          goalsData[index].PercentageSum += currentRec.PercentageOfGoal[j];
        }
        
      }
    }


    for(let i = 0; i < goalsData.length; i++){
      let averagePercentage = Math.floor(goalsData[i].PercentageSum / number);
      goalsData[i].AveragePercentage = averagePercentage;

      if(averagePercentage >= 150){
        results.data.needsNewGoal.push(goalsData[i]);
      } 

      if(averagePercentage > 100){
        results.data.aboveGoal.push(goalsData[i]);
      }
      else if(averagePercentage > 80){
        results.data.nearGoal.push(goalsData[i]);
      }
      else{
        results.data.nowhereNearGoal.push(goalsData[i]);
      }
    }



    if(results.data.needsNewGoal.length > 0){

      for(let i = 0; i < results.data.needsNewGoal.length; i++){
        results.data.paramsToEdit.push(results.data.needsNewGoal[i].Data.Title);
      }
    }

    
    // Weeks since start

    let firstRecord = data.Records[data.Records.length - 1].Date;
    let lastRecord = data.Records[0].Date;
    results.weeks = this.generalService.countWeeks(firstRecord, lastRecord);

    
    console.log("***Analysis results ", results);
    return results;
    
  }

  async analyseVitals(data){

    console.log("***Analysing data ", data)

    let results = {
      "weeks": 0,
      "categories": ["aboveGoal", "nearGoal", "lowerThanGoal"],
      "data": {
        "aboveGoal": [],
        "nearGoal": [],
        "lowerThanGoal": []
      },
      "colors": {
        "nearGoal": "success", 
        "aboveGoal": "danger", 
        "lowerThanGoal": "danger"
      },
      "icons": {
        "aboveGoal": "trending-up", 
        "nearGoal": "remove", 
        "lowerThanGoal": "trending-down"
      }
    };


    let number = 5;
    if(data.Records.length < 5) number = data.Records.length;

    let registeredParams = []
    let goalsData = [];

    for(let i = 0; i < number; i++){
      let currentRec = data.Records[i];
      for(let j = 0; j < currentRec.PercentageOfGoal.length; j++){
        if(currentRec.Values[j] != null){
          let paramData = data.Params.filter((p) => p.Index == currentRec.Params[j])[0];
                  
          let index = registeredParams.indexOf(currentRec.Params[j]);
          if(index < 0){
            // Add param to goalsData array
            goalsData.push({
              Data: paramData,
              PercentageSum: currentRec.PercentageOfGoal[j],
              Number: 1,
              AveragePercentage: 0
            });
            registeredParams.push(currentRec.Params[j]);
          }
          else{
            // Increment result percentage sum 
            goalsData[index].PercentageSum += currentRec.PercentageOfGoal[j];
            goalsData[index].Number++;
          }
        }
      }
    }

    
    for(let i = 0; i < goalsData.length; i++){

      console.log(goalsData[i])
      let averagePercentage = Math.floor(goalsData[i].PercentageSum / goalsData[i].Number);
      goalsData[i].AveragePercentage = averagePercentage;

      if(averagePercentage > 110){
        results.data.aboveGoal.push(goalsData[i]);
      }
      else if(averagePercentage > 80){
        results.data.nearGoal.push(goalsData[i]);
      }
      else{
        results.data.lowerThanGoal.push(goalsData[i]);
      }

    }

    
    // Weeks since start

    let firstRecord = data.Records[data.Records.length - 1].Date;
    let lastRecord = data.Records[0].Date;
    results.weeks = this.generalService.countWeeks(firstRecord, lastRecord);

    console.log("***Analysis results ", results);

    return results;


  }

}
