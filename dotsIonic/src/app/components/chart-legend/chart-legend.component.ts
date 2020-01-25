import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

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

  public showLegend = true;               // Show or hide legend

  @Output() editParamsButtonClicked = new EventEmitter();

  editParams() {
    // Emit editParamsButtonClicked event to parent (data-table.component.html)
      console.log("editp")
    this.editParamsButtonClicked.emit()
  }

  constructor(
    public generalService: GeneralService
  ) { }

  ngOnInit() { }

}
