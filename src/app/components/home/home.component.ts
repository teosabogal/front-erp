import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
