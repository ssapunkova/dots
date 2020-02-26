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
    return (Math.round(parseInt(cm) / 2.54 * 100) / 100);
  }
  public convertToLb(kg){
    return (Math.round(parseInt(kg) * 2.204 * 100) / 100);
  }

  public userParams = {
    Gender: "F"
  }
 
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
  
  async getConstants(){
    let constants = await this.paramsService.getBodyMassConstants(this.userParams.Gender);
    console.log(constants);
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
      formula: async (values) => {
        console.log(values);
        let gender = this.userParams.Gender;
        let weight = this.convertToLb(values[0]);
        let height = this.convertToInches(values[1]);
        let physicalActivity = values[5];
        console.log(weight, physicalActivity, height, gender);

        setTimeout(() => {
          console.log("calc");
          this.getConstants();
        }, 5*1000);

        return weight;
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
