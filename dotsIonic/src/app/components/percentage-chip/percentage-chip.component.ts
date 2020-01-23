import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'percentage-chip',
  templateUrl: './percentage-chip.component.html',
  styleUrls: ['./percentage-chip.component.scss']
})
export class PercentageChip implements OnInit {

  @Input() percentage: Number;

  constructor() {}

  ngOnInit(){}

}
