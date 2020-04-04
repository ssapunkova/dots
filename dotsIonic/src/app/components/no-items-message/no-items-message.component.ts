import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'no-items-message',
  templateUrl: './no-items-message.component.html',
  styleUrls: ['./no-items-message.component.scss']
})
export class NoItemsMessage implements OnInit {

  @Input() percentage: Number;

  constructor() {}

  ngOnInit(){}

}
