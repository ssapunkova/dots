import { Component, Input, OnInit } from '@angular/core';

import { DataTableService } from '../../services/dataTable.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() data: any[];

  constructor(
    public generalService: GeneralService,
    public dataTableService: DataTableService
  ) { }

  ngOnInit() { }

}
