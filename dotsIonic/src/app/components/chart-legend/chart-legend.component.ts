import { Component, Input, EventEmitter, Output } from '@angular/core';

import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ChartLegendComponent implements OnInit {

  @Input() data: any[];
  @Input() goals: any[];
  @Input() colorScheme: any[];

  @Output() editGoalsButtonClicked = new EventEmitter();

  editGoals() {
    // Emit editGoalsButtonClicked event to parent (nutrition.page.html)
    this.editGoalsButtonClicked.emit()
  }

  constructor(
    public generalService: GeneralService
  ) { }

  ngOnInit() { }

}
