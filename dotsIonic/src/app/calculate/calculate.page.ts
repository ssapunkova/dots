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
      Unit: "y.o."
    },
    {
      Title: "gender",
      Options: [
        { "male": "m" },
        { "female": "f" }
      ],
      Unit: ""
    },
    {
      Title: "weight",
      Unit: "kg"
    },
    {
      Title: "height",
      Unit: "cm"
    },
    {
      Title: "waist",
      Unit: "cm"
    },
    {
      Title: "hips",
      Unit: "cm"
    },
    {
      Title: "activity factor",
      Options: [
        { "Seditary": 0.7 },
        { "Light": 1 },
        { "Moderate": 1.3 }
      ]
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
