import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-util-tracking1',
  templateUrl: './util-tracking1.component.html',
  styleUrl: './util-tracking1.component.scss'
})
export class UtilTracking1Component {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public contacts: any[] = [
    {
        id: 1,
        name: 'Jenson Delaney',
        email: 'jenson.delany@mail.com',
        messagesCount: 3
    },
    {
        id: 2,
        name: 'Amaya Coffey',
        email: 'amaya.coffey@mail.com',
        messagesCount: 1
    },
    {
        id: 3,
        name: 'Habib Joyce',
        email: 'habib.joyce@mail.com',
        messagesCount: 5
    },
    {
        id: 4,
        name: 'Lilly-Ann Roche',
        email: 'lilly-ann.roche@mail.com',
        messagesCount: 8
    }
    // {
    //     id: 5,
    //     name: 'Giulia Haworth',
    //     email: 'giulia.haworth@mail.com',
    //     messagesCount: 3
    // },
    // {
    //     id: 6,
    //     name: 'Dawson Humphrey',
    //     email: 'dawson.humphrey@mail.com',
    //     messagesCount: 2
    // },
    // {
    //     id: 7,
    //     name: 'Reilly McCullough',
    //     email: 'reilly.mccullough@mail.com',
    //     messagesCount: 3
    // }
    ];
}
