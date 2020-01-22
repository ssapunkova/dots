import { Component, Input, OnInit} from '@angular/core';

import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'chart-tooltip',
  templateUrl: './chart-tooltip.component.html',
  styleUrls: ['./chart-tooltip.component.scss']
})
export class ChartTooltipComponent implements OnInit {

  @Input() data: any[];

  constructor(
    public generalService: GeneralService
  ) { }

  ngOnInit() { }

}
