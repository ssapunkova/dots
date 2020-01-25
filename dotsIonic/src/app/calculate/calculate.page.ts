import { Component, OnInit } from '@angular/core';

// Services with params
import { ParamsService } from '../services/params.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.page.html',
  styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {

  public params = [
    {
      Title: "age",
      Unit: "y.o.",
      Type: "number"
    },
    {
      Title: "gender",
      Options: [
        { "Title": "male", "Value": "m" },
        { "Title": "female", "Value": "f" }
      ],
      Unit: "",
      Type: "checkbox"
    },
    {
      Title: "weight",
      Unit: "kg",
      Type: "number"
    },
    {
      Title: "height",
      Unit: "cm",
      Type: "number"
    },
    {
      Title: "waist",
      Unit: "cm",
      Type: "number"
    },
    {
      Title: "hips",
      Unit: "cm",
      Type: "number"
    },
    {
      Title: "activity factor",
      Options: [
        { "Title": "Seditary", "Value": 0.7 },
        { "Title": "Light", "Value": 1 },
        { "Title": "Moderate", "Value": 1.3 }
      ],
      Type: "select"
    },
  ]

  public formulas = {
    "Blocks": {
      required: [
        this.params[0],
        this.params[1],
        this.params[2],
        this.params[3],
        this.params[4],
        this.params[5],
        this.params[6]
      ],
      formula: (values) => {
        let age = values[0];
        let gender = values[1];
        if(age < 17) return "a";
        else return "b";
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
