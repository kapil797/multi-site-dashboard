import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

@Component({
  selector: 'app-projected-completion',
  templateUrl: './projected-completion.component.html',
  styleUrl: './projected-completion.component.scss',
})
export class ProjectedCompletionComponent implements OnChanges {
  @Input() header: string;
  @Input() dueDate?: string;
  @Input() completedDate?: string | null;
  @Output() late = new EventEmitter();
  public icon = faClock;
  public displayedDate: string;
  public isLate = false;
  public timeDetails: string;
  public alertImg = 'assets/images/production-tracking/alert.png';

  constructor() {}

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.dueDate) {
      this.displayedDate = 'Not Available';
      this.isLate = true;
      return;
    }

    // Check if order is late.
    this.displayedDate = moment(this.dueDate).format('DD/MM/YYYY HH:mm');
    const timeDiff = this.calcTimeDiff();
    if (timeDiff > 0) {
      this.timeDetails = 'ON TIME';
      this.isLate = false;
      return;
    }
    this.isLate = true;
    this.timeDetails = `LATE BY ${this.getTimeBreakdown(timeDiff * -1)}`;
    this.late.emit();
  }

  private calcTimeDiff() {
    const time1 = new Date(this.dueDate as string).getTime();
    const time2 = this.completedDate ? new Date(this.completedDate).getTime() : Date.now();
    return time1 - time2;
  }

  private getTimeBreakdown(timeDiff: number) {
    // Breakdown miliseconds into hours and mins.
    const hours = Math.floor(timeDiff / (60 * 60 * 1000));
    const mins = Math.round((timeDiff % (60 * 60 * 1000)) / (1000 * 60));
    return `${hours}HR ${mins}MIN`;
  }
}
