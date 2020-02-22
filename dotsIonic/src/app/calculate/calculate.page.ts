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
    return parseInt(parseInt(cm) / 2.54);
  }
  public convertToLb(kg){
    return parseInt(parseInt(kg) * 2.204);
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
        this.params[1],
        this.params[2],
        this.params[3],
        this.params[4],
        this.params[5],
        this.params[6]
      ],
      formula: (values) => {
        // let gender = values[0];
        let weight = this.convertToLb(values[1]);
        let physicalActivity = values[6];
        console.log(weight, physicalActivity);
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
