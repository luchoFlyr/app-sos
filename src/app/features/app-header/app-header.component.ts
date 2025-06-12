import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './template/app-header.component.html',
  styleUrls: ['./styles/app-header.component.scss'],
  standalone: false,
})

export class AppHeaderComponent implements OnInit {

  @Input() title: string = 'Emergencias';
  @Input() icon: string = 'alert-circle-outline';
  @Input() color: string = "--ion-color-primary";
  constructor() { }

  ngOnInit() { }


  

}

