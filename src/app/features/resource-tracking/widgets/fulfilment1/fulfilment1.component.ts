import { Component } from '@angular/core';

@Component({
  selector: 'app-fulfilment1',
  templateUrl: './fulfilment1.component.html',
  styleUrl: './fulfilment1.component.scss',
})
export class Fulfilment1Component {
  public seriesData: number[] = [90, 92, 93, 91, 92];
  public categories: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  public average: number = 92;
  public areaData: number[] = [95, 95, 95, 95, 95];
}
