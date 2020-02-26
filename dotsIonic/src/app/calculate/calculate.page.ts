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
    return Math.round(parseInt(cm) / 2.54);
  }
  public convertToLb(kg){
    return Math.round(parseInt(kg) * 2.204);
  }
 
  public params = [
    {
      Title: "age",
      Unit: "y.o.",                                   // 0 - age
      Type: "number"
    },
    {
      Title: "gender",
      Options: [
        { "Title": "male", "Value": "m" },
        { "Title": "female", "Value": "f" }           // 1 - gender
      ],
      Unit: "",
      Type: "checkbox"
    },
    {
      Title: "weight",
      Unit: "kg",                                     // 2 - weight
      Type: "number"
    },
    {
      Title: "height",
      Unit: "cm",                                     // 3 - height
      Type: "number"
    },
    {
      Title: "waist",
      Unit: "cm",                                     // 4 - waist
      Type: "number"
    },
    {
      Title: "hips",
      Unit: "cm",                                     // 5 - hips
      Type: "number"
    },
    {
      Title: "activity factor",
      Options: [
        { "Title": "Seditary", "Value": 0.7 },
        { "Title": "Light", "Value": 1 },             // 6 - activity factor
        { "Title": "Moderate", "Value": 1.3 }
      ],
      Type: "select"
    },
  ]

  public formulas = {
    "Blocks": {
      required: [
        this.params[1],      // 0 - gender
        this.params[2],      // 1 - weight
        this.params[3],      // 2 - height
        this.params[4],      // 3 - waist
        this.params[5],      // 4 - hips
        this.params[6]       // 5 - activity
      ],
      formula: (values) => {
        console.log(values);
        let gender = values[0];
        let weight = this.convertToLb(values[1]);
        let height = this.convertToInches(values[2]);
        let physicalActivity = values[5];
        console.log(weight, physicalActivity, height, gender);
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
