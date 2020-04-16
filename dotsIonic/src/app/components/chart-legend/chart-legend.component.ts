import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ChartLegendComponent implements OnInit {

  @Input() legendTitle: String;
  @Input() data: any[];
  @Input() goals: any[];
  @Input() colorScheme: any[];

  public showLegend = true;               // Show or hide legend

  @Output() editParamsButtonClicked = new EventEmitter();

  editParams() {
    // Emit editParamsButtonClicked event to parent (data-table.component.html)
    this.editParamsButtonClicked.emit()
  }

  constructor(
    public generalService: GeneralService
  ) { }

  ngOnInit() { 
    if(this.data.length > 6){
      this.showLegend = false;
    }
  }

}
