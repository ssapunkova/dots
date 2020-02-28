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
    return (Math.round(parseInt(cm) / 2.54));
  }
  public convertToLb(kg){
    return (Math.round(parseInt(kg) * 2.204));
  }

  public userParams = {
    Gender: "F"
  }

  public result;

  public bodyMassConstants = [];
 
  public params = [
    {
      Title: "age",
      Unit: "y.o.",                                   // 0 - age
      Type: "number"
    },
    // {
    //   Title: "gender",
    //   Options: [
    //     { "Title": "male", "Value": "m" },
    //     { "Title": "female", "Value": "f" }           // 1 - gender
    //   ],
    //   Unit: "",
    //   Type: "checkbox"
    // },
    {
      Title: "weight",
      Unit: "kg",                                     // 1 - weight
      Type: "number"
    },
    {
      Title: "height",
      Unit: "cm",                                     // 2 - height
      Type: "number"
    },
    {
      Title: "waist",
      Unit: "cm",                                     // 3 - waist
      Type: "number"
    },
    {
      Title: "hips",
      Unit: "cm",                                     // 4 - hips
      Type: "number"
    },
    {
      Title: "activity factor",
      Options: [
        { "Title": "Seditary", "Value": 0.7 },
        { "Title": "Light", "Value": 1 },             // 5 - activity factor
        { "Title": "Moderate", "Value": 1.3 }
      ],
      Type: "select"
    },
  ]


  async calculate(param, values){
    console.log(param, values);
    this.formulas[param].formula(values);
  }

  async getConst(gender){
    if(this.bodyMassConstants.length == 0){
      this.paramsService.getConstants(gender).subscribe((data: any) => {
        console.log(data);
        this.bodyMassConstants = data;
      });
    }
  };

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
          weight: this.convertToLb(input[0]),
          height: this.convertToInches(input[1]),
          waist: this.convertToInches(input[2]),
          hips: this.convertToInches(input[3]),
          physicalActivity:  input[4]
        };

        let constants = { A: 0, B: 0, C: 0 };

        // console.log("calc");
        // console.log(input);
        // console.log(values);

        // if(this.bodyMassConstants.length == 0){
          // this.getConst(values.gender).then()
        // }
        
        this.getConst(values.gender).then(() => {
          console.log(values);
          console.log(this.bodyMassConstants);
          if(values.gender == "F"){
            constants.A = this.bodyMassConstants.filter((record) => record.Hips == values.hips)[0].Constant;
          }
          
          console.log("const", constants);
        
        });

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
