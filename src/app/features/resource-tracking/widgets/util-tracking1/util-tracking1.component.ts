import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-util-tracking1',
  templateUrl: './util-tracking1.component.html',
  styleUrl: './util-tracking1.component.scss',
})
export class UtilTracking1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  // According to Kendo,
  // set the style.height to enable vertical scroll
  // when exceed viewList height.
  public viewListHeight = '14rem';

  public data = {
    eScentz: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '73%',
        color: '#60EA80',
      },
      {
        title: 'Oven 1 & 2:',
        subtitle: 'Past 1 Hr',
        value: '56%',
        color: '#60EA80',
      },
      {
        title: 'Scent Filling:',
        subtitle: 'Past 1 Hr',
        value: '97%',
        color: '#F9B959',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
    ],
    mfConnectPlus: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '12%',
        color: '#60EA80',
      },
      {
        title: 'Oven 1 & 2:',
        subtitle: 'Past 1 Hr',
        value: '43%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '10%',
        color: '#60EA80',
      },
    ],
    atomiserMTS: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '10%',
        color: '#60EA80',
      },
    ],
  };
}
