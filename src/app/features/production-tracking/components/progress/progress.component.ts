import { Component, Input } from '@angular/core';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

import { progressColors } from '@core/constants/progress-bar.constant';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  @Input() progress?: number;
  public progressColors = progressColors;
  public icon = faArrowRotateRight;
}
