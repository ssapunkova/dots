import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { GeneralService } from '../../services/general.service';
import { TimeAndDateService } from '../../services/timeAndDate.service';
import { ChartService } from '../../services/chart.service';
import { DataTableService } from '../../services/dataTable.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() data: any[];
  @Input() records: any[];
  @Input() service: String;

  @Output() addRecordClicked = new EventEmitter();

  addRecord() {
    // Emit editGoalsButtonClicked event to parent (nutrition.page.html)
    this.addRecordClicked.emit()
  }

  constructor(
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService,
    public generalService: GeneralService,
    public alertController: AlertController,
    public modalController: ModalController,
    public dataTableService: DataTableService
  ) { }


  ngOnInit(){
    this.dataTableService.initializeDataTable(this.data, this.records, this.service);
  }

}
