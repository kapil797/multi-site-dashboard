import { ChangeDetectorRef, Component } from '@angular/core';

import { FeatureService } from '@core/services/feature.service';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrl: './multi-site.component.scss',
})
export class MultiSiteComponent {
  constructor(
    private featureService: FeatureService,
    private cdr: ChangeDetectorRef
  ) {}
}
