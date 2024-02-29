import { trigger, style, animate, transition, query, group, animateChild } from '@angular/animations';
import { DialogAnimation } from '@progress/kendo-angular-dialog';

export const dialogAnimation: DialogAnimation = {
  duration: 500,
  type: 'fade',
};

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translate3d(0, -100%, 0)', opacity: 0 }),
    animate('0.6s', style({ transform: 'translate3d(0, 0, 0)', opacity: 1 })),
  ]),
  transition(':leave', [
    style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }),
    animate('0.6s', style({ transform: 'translate3d(0, -10rem, 0)', opacity: 0, height: 0 })),
  ]),
]);

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('0.5s', style({ opacity: 0 }))]),
]);

export const routeAnimations = trigger('routeAnimations', [
  transition('* => *', [
    query(':leave', animateChild(), { optional: true }),
    query(':enter', [style({ opacity: 0 }), animate('0.5s ease-out', style({ opacity: 1 }))], { optional: true }),
  ]),
  // for sliding in and out, need to fix CSS as it will corrupt the leaving component
  transition('dummy => dummy', [
    style({ position: 'relative' }),
    query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          animate('3s ease-out', style({ transform: 'translateX(0%)', opacity: 1 })),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [style({ opacity: 1 }), animate('3s ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))],
        { optional: true }
      ),
    ]),
  ]),
]);
