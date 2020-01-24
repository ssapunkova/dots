import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { GeneralService } from '../../services/general.service';
import { ChartService } from '../../services/chart.service';
import { DataTableService } from '../../services/dataTable.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() general: [];
  @Input() records: [];
  @Input() service: String;

  // Event emitters for click actions inside data-table component
  @Output() addRecordClicked = new EventEmitter();
  @Output() editRecordClicked = new EventEmitter();
  @Output() deleteRecordClicked = new EventEmitter();

  constructor(
    public chartService: ChartService,
    public generalService: GeneralService,
    public dataTableService: DataTableService
  ) { }


  ngOnInit(){
    this.dataTableService.initializeDataTable(this.general, this.records, this.service);
  }

  async addRecord() {
    // Emit addRecordClicked event to parent (nutrition.page.html)
    this.addRecordClicked.emit()
  }

  async editRecord($event){
    // Emit editRecordClicked event to parent (nutrition.page.html)
    this.editRecordClicked.emit($event)
  }

  async deleteRecord($event) {
    // Emit addRecordClicked event to parent (nutrition.page.html)
    this.deleteRecordClicked.emit($event)
  }

}
