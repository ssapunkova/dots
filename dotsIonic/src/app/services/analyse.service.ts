import { Injectable } from '@angular/core';

import { DataTableService } from './dataTable.service';



// Analyse Service
// Analyses workout/nutrition data from db

@Injectable()
export class AnalyseService{

  constructor(
    public dataTableService: DataTableService
  ) {}

  
  public resultsCategories = [];
  public categoryColors = {};

  public categoryIcons = {};

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

  }

}
