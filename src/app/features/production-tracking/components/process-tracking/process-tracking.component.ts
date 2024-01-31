import { Component, EventEmitter, Output } from '@angular/core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-process-tracking',
  templateUrl: './process-tracking.component.html',
  styleUrl: './process-tracking.component.scss',
})
export class ProcessTrackingComponent {
  @Output() toggle = new EventEmitter<string>();

  public icon = faEllipsis;

  constructor() {}

  public onToggleProcess(event: string) {
    this.toggle.emit(event);
  }
}
