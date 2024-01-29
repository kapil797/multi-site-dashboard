import { Component, Input } from '@angular/core';

export interface CardData {
  srcImg: string;
  header: string;
  content: string[];
  fillSpace?: boolean;
}

@Component({
  selector: 'app-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss',
})
export class CustomCardComponent {
  @Input() data: CardData;
  constructor() {}
}
