import { AfterViewInit, Component, ElementRef, Input, ViewChild, effect } from '@angular/core';
import { Factory } from '@core/models/factory.model';
import { AppService } from '@core/services/app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar: ElementRef;
  @Input() header: string;
  @Input() rotate: string;
  public factory: string;

  constructor(private app: AppService) {
    effect(() => {
      switch (this.app.factory()) {
        case Factory.MODEL_FACTORY:
          this.factory = 'mf';
          break;
        case Factory.MICRO_FACTORY:
          this.factory = 'umf';
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.rotate === 'LEFT') this.sidebar.nativeElement.style.transform = 'rotate(180deg)';
    if (this.rotate === 'TOP') this.sidebar.nativeElement.style.transform = 'rotate(360deg)';
  }
}
