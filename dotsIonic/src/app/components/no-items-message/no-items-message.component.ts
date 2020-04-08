import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'no-items-message',
  templateUrl: './no-items-message.component.html',
  styleUrls: ['./no-items-message.component.scss']
})
export class NoItemsMessage implements OnInit {

  @Input() headerMessage;
  @Input() buttonLabel;
  @Output() buttonClicked = new EventEmitter();

  constructor(
    public translate: TranslateService
  ) {}

  ngOnInit(){
  }

  async buttonFunction(){
    this.buttonClicked.emit();
  }

}
