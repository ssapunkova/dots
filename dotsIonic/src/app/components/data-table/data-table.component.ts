import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { GeneralService } from '../../services/general.service';
import { ChartService } from '../../services/chart.service';
import { DataTableService } from '../../services/dataTable.service';
import { AnalyseService } from 'src/app/services/analyse.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent  {

  @Input() legendTitle;
  @Input() color;

  // Event emitters for click actions inside data-table component
  @Output() showRecordOptionsClicked = new EventEmitter();
  @Output() addRecordClicked = new EventEmitter();
  @Output() editParamsButtonClicked = new EventEmitter();

  

  public showAnalysisDetails = {
    aboveGoal: false,
    belowGoal: false,
    nowhereNearGoal: false
  }


  constructor(
    public chartService: ChartService,
    public generalService: GeneralService,
    public dataTableService: DataTableService,
    public analyseService: AnalyseService
  ) { }

  
  async toggleAnalysisDetails(category){
    if(this.showAnalysisDetails[category] == true) this.showAnalysisDetails[category] = false;
    else this.showAnalysisDetails[category] = true;
  }

  async addRecord() {
    // Emit addRecordClicked event to parent (vitals.page.html)
    this.addRecordClicked.emit();
  }

  async editParams(){
    // Emit editParamsButtonClicked event to parent (vitals.page.html)
    this.editParamsButtonClicked.emit();
  }

  async showRecordOptions($event){
    // Emit showRecordOptionsClicked event to parent (vitals.page.html)
    this.showRecordOptionsClicked.emit($event);
  }


}
