import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor() { }

  @Input() message:string;
  @Output() close= new EventEmitter<void>();
  ngOnInit() {
  }
  onClose(){
    this.close.emit();
  }

}
