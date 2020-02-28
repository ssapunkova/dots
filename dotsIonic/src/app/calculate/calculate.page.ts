import { Component, OnInit } from '@angular/core';

// Services with params
import { ParamsService } from '../services/params.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.page.html',
  styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {

  // Converting measures

  public convertToInches(cm){
    return (Math.floor(parseInt(cm) / 2.54));
  }
  public convertToLb(kg){
    return (Math.floor(parseInt(kg) * 2.204));
  }

  public userParams = {
    Gender: "F"
  }

  public result;

  public userResult = {};

  public bodyMassConstants = [];
 
  public params = [
    {
      Title: "age",
      Unit: "y.o.",                                        // 0 - age
      Type: "number"
    },
    // {
    //   Title: "gender",
    //   Options: [
    //     { "Title": "male", "Value": "m" },
    //     { "Title": "female", "Value": "f" }             // 1 - gender
    //   ],
    //   Unit: "",
    //   Type: "checkbox"
    // },
    {
      Title: "weight",
      Unit: "kg",                                          // 1 - weight
      Type: "number"
    },
    {
      Title: "height",
      Unit: "cm",                                          // 2 - height
      Type: "number"
    },
    {
      Title: "waist",
      Unit: "cm",                                          // 3 - waist
      Type: "number"
    },
    {
      Title: "hips",
      Unit: "cm",                                          // 4 - hips
      Type: "number"
    },
    {
      Title: "activity factor",
      Options: [
        { "Title": "Seditary", "Value": 0.5 },
        { "Title": "Light", "Value": 0.6 },    
        { "Title": "Workout3TimesAWeek", "Value": 0.7 },   // 5 - activity factor
        { "Title": "LightWorkoutEveryDay", "Value": 0.8 },
        { "Title": "HeavyWorkoutEveryDay", "Value": 0.9 },
        { "Title": "Professional", "Value": 1 }
      ],
      Type: "select"
    },
  ]


  async triggerCalculation(param, values){
    console.log(param, values);
    this.formulas[param].formula(values);
  }


  public formulas = {
    "Blocks": {
      required: [
        this.params[1],      // 1 - weight
        this.params[2],      // 2 - height
        this.params[3],      // 3 - waist
        this.params[4],      // 4 - hips
        this.params[5]       // 5 - activity
      ],
      formula: async (input) => {

        let values = {
          gender: this.userParams.Gender,
          weightInKg: input[0],
          weight: this.convertToLb(input[0]),
          height: this.convertToInches(input[1]),
          waist: this.convertToInches(input[2]),
          hips: this.convertToInches(input[3]),
          physicalActivity:  input[4]
        };

        let constants = { A: 0, B: 0, C: 0 };
        
        let that = this;
        function setConstants(){
          if(values.gender == "F"){
            constants.A = that.bodyMassConstants.filter((record) => record.Hips == values.hips)[0].Constant;
            constants.B = parseFloat((values.waist / 1.406).toFixed(2));
            constants.C = parseFloat((values.height / 1.640).toFixed(2));
          }
          console.log(constants);

          calculateFatAndBodyMass();
        }


        function calculateFatAndBodyMass(){

          // Body fat percentage
          if(values.gender == "F") that.result.fatPercentage = Math.floor(constants.A + constants.B - constants.C);
          else that.result.fatPercentage = Math.floor(constants.A);

          // Calculate LeanBodyMass weight in Lb, to use for DaylyProteinIntakeInGr
          that.result.leanBodyMassInLb = that.convertToLb(values.weightInKg - (values.weightInKg * that.result.fatPercentage / 100));

          // Dayly Protein Intake in grams
          that.result.daylyProteinIntakeInGr = that.result.leanBodyMassInLb * values.physicalActivity;

          // Convert gr to protein blocks
          that.result.blocksPerDay = Math.floor(that.result.daylyProteinIntakeInGr / 7);

          if(values.gender == "F" && that.result.blocksPerDay <= 11) that.result.blocksPerDay = 11;
          else if(values.gender == "M" && that.result.blocksPerDay <= 14) that.result.blocksPerDay = 14;

          that.userResult["Blocks"] = that.result.blocksPerDay;
        }

        if(this.bodyMassConstants.length == 0){
          this.paramsService.getConstants(values.gender).subscribe((data: any) => {
            console.log(data);
            this.bodyMassConstants = data;
            setConstants();
          });
        }
        else{
          setConstants();
        }

        this.result = values;
      }
    }
  }

  public values = {
    "nutrition": []
  }

  constructor(
    public paramsService: ParamsService
  ) { }

  ngOnInit() {
  }

}
