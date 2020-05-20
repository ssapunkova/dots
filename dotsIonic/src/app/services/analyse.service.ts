import { Injectable } from '@angular/core';

import { DataTableService } from './dataTable.service';



// Analyse Service
// Analyses workout/nutrition data from db

@Injectable()
export class AnalyseService{

  constructor(
    public dataTableService: DataTableService
  ) {}

  async analyseWorkoutResults(data){
    
    console.log("***Analysing data ", data)

    let results = {
      "needsNewGoal": [],
      "aboveGoal": [],
      "belowGoal": [],
      "nowhereNearGoal": []
    };

    let goalsData = [];

    let registeredParams = [];

    for(let i = 0; i < 5; i++){
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
      let averagePercentage = Math.floor(goalsData[i].PercentageSum / 5);
      goalsData[i].AveragePercentage = averagePercentage;

      if(averagePercentage >= 150){
        results.needsNewGoal.push(goalsData[i]);
      } 

      if(averagePercentage > 100){
        results.aboveGoal.push(goalsData[i]);
      }
      else if(averagePercentage > 75){
        results.belowGoal.push(goalsData[i]);
      }
      else{
        results.nowhereNearGoal.push(goalsData[i]);
      }

    }

    console.log("***Analysis results ", results);

    this.dataTableService.resultsAnalysis = results;

    if(results.needsNewGoal.length > 0){

      let paramsToEdit = [];

      let message = await this.translate.instant("TooGoodResults") + ":";
      for(let i = 0; i < results.needsNewGoal.length; i++){
        let title = results.needsNewGoal[i].Data.Title;
        message += title;
        paramsToEdit.push(title);
      }
      
      // console.log(paramsToEdit)

      // let alert = await this.alertController.create({
      //   header: this.translate.instant("GoalsThatNeedUpdating"),
      //   message: message,
      //   buttons: [
      //     {
      //       text: this.translate.instant("Cancel"),
      //       role: 'cancel',
      //       cssClass: 'secondary'
      //     },
      //     {
      //       text: this.translate.instant("UpdateGoalNow"),
      //       handler: () => this.editParams(paramsToEdit)
      //     }
      //   ]
      // })
      
      // await alert.present();

    }

  }

}
