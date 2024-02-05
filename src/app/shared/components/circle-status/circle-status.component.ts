import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-status',
  templateUrl: './circle-status.component.html',
  styleUrl: './circle-status.component.scss',
})
export class CircleStatusComponent {
  @Input() status: 'SUCCESS' | 'ERROR' | 'WARNING';

  public mapStatusToColor() {
    if (this.status === 'SUCCESS') return '#21d794';
    else if (this.status === 'ERROR') return '#F7545E';
    return '#fab95c';
  }
}
