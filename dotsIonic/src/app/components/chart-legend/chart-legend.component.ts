import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html'
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

  constructor() { }

  ngOnInit() { }

}
