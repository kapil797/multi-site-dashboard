import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-projected-completion',
  templateUrl: './projected-completion.component.html',
  styleUrl: './projected-completion.component.scss',
})
export class ProjectedCompletionComponent implements OnInit {
  @Input() dueDate: string;
  @Input() completedDate?: string;
  public displayedDate: string;
  public isLate = false;
  public timeDetails: string;
  public alertImg = 'assets/images/production-tracking/alert.png';

  constructor() {}

  ngOnInit(): void {
    this.displayedDate = moment(this.dueDate).format('DD/MM/YYYY HH:mm');

    const timeDiff = this.calcTimeDiff();
    if (timeDiff > 0) {
      this.timeDetails = 'ON TIME';
      return;
    }
    this.isLate = true;
    this.timeDetails = `LATE BY ${this.getTimeBreakdown(timeDiff * -1)}`;
  }

  private calcTimeDiff() {
    const time1 = new Date(this.dueDate).getTime();
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
