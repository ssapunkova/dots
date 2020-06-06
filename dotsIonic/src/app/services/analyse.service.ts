import { Injectable } from '@angular/core';

import { DataTableService } from './dataTable.service';
import { GeneralService } from './general.service';
import { isBuffer } from 'util';



// Analyse Service
// Analyses workout/nutrition data from db

@Injectable()
export class AnalyseService{

  constructor(
    public dataTableService: DataTableService,
    private generalService: GeneralService
  ) {}

  
  public resultsCategories = [];
  public categoryColors = {};

  public categoryIcons = {};

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
      
      stats.StartAndNow[i] = {
        "StartPercentage": 0, 
        "CurrentPercentage": 0, 
        "Diff": 0
      };

      let entries = data[i].WorkoutRecords.length;
      let firstEntry = data[i].WorkoutRecords[0];
      let lastEntry = data[i].WorkoutRecords[entries - 1];
      let weeks = this.generalService.countWeeks(firstEntry.Date, lastEntry.Date);

      console.log(weeks);

      // Frequency
      stats.Frequency[i] = entries / weeks;
      stats.OverallFrequency += stats.Frequency[i];

      let analyseEntries = [firstEntry, lastEntry];
      let labels = ["StartPercentage", "CurrentPercentage"];

      // Start and now

      for(let e = 0; e < analyseEntries.length; e++){

        let entry = analyseEntries[e];
        let sum = 0;
        for(let v = 0; v < entry.Values.length; v++){
          sum += this.generalService.calculatePercentage(entry.Values[v], data[i].Params[v].Goal);
        }
        
        stats.StartAndNow[i][labels[e]] += sum / entry.Values.length;

      }

      stats.StartAndNow[i].Diff = stats.StartAndNow[i].CurrentPercentage - stats.StartAndNow[i].StartPercentage;
      

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

  async getNutritionStats(){

  }

  async analyseWorkoutResults(data){
    
    console.log("***Analysing data ", data)


    let results = {
      "paramsToEdit": [],
      "needsNewGoal": [],
      "aboveGoal": [],
      "nearGoal": [],
      "nowhereNearGoal": []
    };

    this.resultsCategories = ["aboveGoal", "nearGoal", "nowhereNearGoal"];
    this.categoryColors = {
      "aboveGoal": "warning", 
      "nearGoal": "success", 
      "nowhereNearGoal": "danger"
    };

    this.categoryIcons = {
      "aboveGoal": "trending-up", 
      "nearGoal": "remove", 
      "nowhereNearGoal": "trending-down"
    }

    
    let number = 5;
    if(data.WorkoutRecords.length < 5) number = data.WorkoutRecords.length;

    let goalsData = [];
    let registeredParams = [];

    for(let i = 0; i < number; i++){
      let currentRec = data.WorkoutRecords[i];
      for(let j = 0; j < currentRec.PercentageOfGoal.length; j++){
        let paramData = data.Params.filter((p) => p._id == currentRec.Params[j])[0];
                
        let index = registeredParams.indexOf(currentRec.Params[j]);
        if(index < 0){
          // Add param to goalsData array
          console.log(currentRec);
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
        results.needsNewGoal.push(goalsData[i]);
      } 

      if(averagePercentage > 100){
        results.aboveGoal.push(goalsData[i]);
      }
      else if(averagePercentage > 80){
        results.nearGoal.push(goalsData[i]);
      }
      else{
        results.nowhereNearGoal.push(goalsData[i]);
      }
    }

    console.log("***Analysis results ", results);

    this.dataTableService.resultsAnalysis = results;

    if(results.needsNewGoal.length > 0){

      for(let i = 0; i < results.needsNewGoal.length; i++){
        this.dataTableService.resultsAnalysis.paramsToEdit.push(results.needsNewGoal[i].Data.Title);
      }
    }

    
    // Weeks since start

    let firstEntry = data.WorkoutRecords[data.WorkoutRecords.length - 1].Date;
    let lastEntry = data.WorkoutRecords[0].Date;
    let weeks = this.generalService.countWeeks(firstEntry, lastEntry);
    console.log(weeks);
    this.dataTableService.weeksSinceStart = weeks;
    
  }

  async analyseNutrition(data){
    console.log(data);

    console.log("***Analysing data ", data)

    let results = {
      "aboveGoal": [],
      "nearGoal": [],
      "lowerThanGoal": [],
      "nowhereNearGoal": []
    };

    
    this.resultsCategories = ["aboveGoal", "nearGoal", "lowerThanGoal"];
    this.categoryColors = {
      "nearGoal": "success", 
      "aboveGoal": "danger", 
      "lowerThanGoal": "danger"
    };

    this.categoryIcons = {
      "aboveGoal": "trending-up", 
      "nearGoal": "remove", 
      "lowerThanGoal": "trending-down"
    }

    let registeredParams = []
    let goalsData = [];

    console.log("start")

    let number = 5;
    if(data.records.length < 5) number = data.records.length;

    for(let i = 0; i < number; i++){
      let currentRec = data.records[i];
      console.log(currentRec, currentRec.Date, currentRec.PercentageOfGoal);
      for(let j = 0; j < currentRec.PercentageOfGoal.length; j++){
        let paramData = data.general.Params.filter((p) => p.Index == currentRec.Params[j])[0];

        console.log(paramData);
                
        let index = registeredParams.indexOf(currentRec.Params[j]);
        if(index < 0){
          // Add param to goalsData array
          console.log(currentRec);
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

      if(averagePercentage >= 150 || averagePercentage < 50){
        results.nowhereNearGoal.push(goalsData[i]);
      } 
      else{
        if(averagePercentage > 110){
          results.aboveGoal.push(goalsData[i]);
        }
        else if(averagePercentage > 80){
          results.nearGoal.push(goalsData[i]);
        }
        else{
          results.lowerThanGoal.push(goalsData[i]);
        }
      }

    }

    console.log("***Analysis results ", results);

    this.dataTableService.resultsAnalysis = results;

    console.log(goalsData);

    // Weeks since start

    let firstEntry = data.records[data.records.length - 1].Date;
    let lastEntry = data.records[0].Date;
    let weeks = this.generalService.countWeeks(firstEntry, lastEntry);
    console.log(weeks);
    this.dataTableService.weeksSinceStart = weeks;

  }

}
