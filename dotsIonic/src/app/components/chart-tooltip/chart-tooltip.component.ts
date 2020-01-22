import { Component, Input } from '@angular/core';

@Component({
  selector: 'chart-tooltip',
  templateUrl: './chart-tooltip.component.html'
})
export class ChartTooltipComponent implements OnInit {

  @Input() data: any[];

  constructor() { }

  ngOnInit() { }

}
