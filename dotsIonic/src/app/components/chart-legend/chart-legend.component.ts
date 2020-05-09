import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ChartLegendComponent {

  @Input() legendTitle: String;
  @Input() color;
  @Input() data: any[];
  @Input() goals: any[];
  @Input() resultsAnalysis: any[];
  @Input() colorScheme: any[];

  public showLegend = false;               // Show or hide legend

  @Output() editParamsButtonClicked = new EventEmitter();

  editParams() {
    // Emit editParamsButtonClicked event to parent (data-table.component.html)
    this.editParamsButtonClicked.emit()
  }

  constructor(
    public generalService: GeneralService
  ) { }

  async toggleLegend(){
    console.log("toggle");
    if(this.showLegend == true) this.showLegend = false;
    else this.showLegend = true;
  }

}
