import { Component, Input, OnInit } from '@angular/core';

import { DataTableService } from '../../services/dataTable.service';

@Component({
  selector: 'toggle-showing-mode',
  templateUrl: './toggle-showing-mode.component.html',
  styleUrls: ['./toggle-showing-mode.component.scss']
})
export class ToggleShowingMode implements OnInit {

  constructor(
    public dataTableService: DataTableService
  ) { }


  ngOnInit(){ }

}
