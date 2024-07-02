import { AfterViewInit, Component, ElementRef, Input, ViewChild, effect } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { Factory } from '@core/models/factory.model';
import { AppService } from '@core/services/app.service';
import { ThemeService } from '@core/services/theme-service.service';

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
  theme?: Theme;

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
  }

  setThemeVariables(): void {
    if (this.theme) {
      document.documentElement.style.setProperty('--ribbon', this.theme.ribbon);
    }
  }
  constructor(
    private app: AppService,
    private themeService: ThemeService
  ) {
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
