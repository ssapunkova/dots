import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'toggle-register-login',
  templateUrl: './toggle-register-login.component.html',
  styleUrls: ['./toggle-register-login.component.scss']
})
export class ToggleRegisterLogin implements OnInit {
  
  @Input() value: String;

  constructor() { }

  ngOnInit(){ }

}
