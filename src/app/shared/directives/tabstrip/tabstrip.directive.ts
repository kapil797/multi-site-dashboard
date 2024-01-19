import { AfterViewInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { getBaseUrl } from '@core/utils/routing';

export interface BaseTab {
  title: string;
  selected: boolean;
  tabContents: unknown[];
}

@Directive({
  selector: '[appTabStrip]',
  standalone: true,
})
export class TabStripDirective implements AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private host: TabStripComponent
  ) {}

  ngAfterViewInit(): void {
    // Navigate to fragment tab on page refresh.
    setTimeout(() => {
      this.route.fragment.pipe(take(1)).subscribe(fragment => {
        if (fragment) {
          const tab = this.host.tabs.find(tab => tab.title === fragment.toUpperCase());
          if (tab) {
            tab.selected = true;
            return;
          }
        }
        // Set first tab as default selected.
        if (this.host.tabs.length > 0) this.host.tabs.first.selected = true;
      });
    });
  }

  public addFragmentToUrl(fragment: string) {
    this.router.navigate([getBaseUrl(this.router)], { fragment });
  }
}
