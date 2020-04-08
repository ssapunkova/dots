import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { GeneralService } from '../../services/general.service';
import { ChartService } from '../../services/chart.service';
import { DataTableService } from '../../services/dataTable.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent  {

  @Input() service: String;

  // Event emitters for click actions inside data-table component
  @Output() showRecordOptionsClicked = new EventEmitter();
  @Output() addRecordClicked = new EventEmitter();
  @Output() editParamsButtonClicked = new EventEmitter();

  constructor(
    public chartService: ChartService,
    public generalService: GeneralService,
    public dataTableService: DataTableService
  ) { }

  async addRecord() {
    // Emit addRecordClicked event to parent (nutrition.page.html)
    this.addRecordClicked.emit();
  }

  async editParams(){
    // Emit editParamsButtonClicked event to parent (nutrition.page.html)
    this.editParamsButtonClicked.emit();
  }

  async showRecordOptions($event){
    // Emit showRecordOptionsClicked event to parent (nutrition.page.html)
    this.showRecordOptionsClicked.emit($event);
  }


}
