import { AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TileLayoutItemComponent, TileLayoutReorderEvent, TileLayoutComponent } from '@progress/kendo-angular-layout';
import { take, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@shared/shared.module';
import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { Factory } from '@core/models/factory.model';
import { NavItem, mfNavItems, umfNavItems } from './nav-menu.constant';
import { RoutePaths } from '@core/constants/routes.constant';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavMenuComponent extends CancelSubscription implements OnInit, AfterViewInit {
  @ViewChild('dropzone') dropzone: TileLayoutItemComponent;
  @ViewChild('tileLayout') tileLayout: TileLayoutComponent;
  public columns: number;
  public navItems: NavItem[];
  public factoryMap: string;
  public dropzoneOrder: number; // Last element of navItems. 0-indexed.
  public RoutePaths = RoutePaths;
  public imgMf: string;
  public imgUmf: string;
  public Factory = Factory;
  public currentFactory = 'assets/images/factories/big.png';
  private altFactory = 'assets/images/factories/small.png';
  private observer: MutationObserver;

  constructor(
    private zone: NgZone,
    private router: Router,
    private app: AppService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res === Factory.MODEL_FACTORY) {
        this.navItems = mfNavItems;
        this.columns = 4;
        this.factoryMap = 'assets/images/factories/map-mf.png';
        this.imgMf = this.currentFactory;
        this.imgUmf = this.altFactory;
      } else if (res === Factory.MICRO_FACTORY) {
        this.navItems = umfNavItems;
        this.columns = 3;
        this.factoryMap = 'assets/images/factories/map-umf.png';
        this.imgUmf = this.currentFactory;
        this.imgMf = this.altFactory;
      }
      this.dropzoneOrder = this.navItems.length;
    });
  }

  ngAfterViewInit(): void {
    this.displayHintOverDropzone();
  }

  private mutationObserverCallback() {
    const el = this.dropzone.elem.nativeElement as Element;
    if (this.tileLayout.targetOrder === this.dropzoneOrder) el.classList.add('dropzone-hint');
    else el.classList.remove('dropzone-hint');
  }

  private displayHintOverDropzone() {
    // Unable to use DOM API for dragenter.
    // Workaround to ensure when the dragged item is hovered over the dropzone,
    // the background color is changed.
    const callback = this.mutationObserverCallback.bind(this);
    this.observer = new MutationObserver(callback);
    const layoutHint = document.querySelector('.k-layout-item-hint.k-layout-item-hint-reorder') as Element;
    this.observer.observe(layoutHint, { attributes: true });
  }

  public onNavigateToLayer(event: number, layer: string) {
    const item = this.navItems.at(event);
    if (!item) return;
    // ActivatedRoute only contains info about a route associated with a
    // component loaded in an router outlet. However, nav-menu is outside of it.
    // Hence, using ActivatedRoute will have an empty routeTree.
    // Workaround is to pass an absolute path.
    this.zone.run(() => {
      this.app.factory$.pipe(take(1)).subscribe(res => {
        this.router.navigate([res.toLowerCase(), item.resource, layer]);
      });
      this.app.resetDialog();
    });
  }

  public onReorder(event: TileLayoutReorderEvent) {
    // No reorder is performed, only navigating to layer2 if applicable.
    event.preventDefault();

    if (event.newIndex < this.navItems.length) return;
    this.onNavigateToLayer(event.oldIndex, RoutePaths.LAYER_TWO);
  }

  public onChangeSite(event: string) {
    this.app.factory$.pipe(take(1)).subscribe(res => {
      if (event === res) return;
      this.router.navigate([event]);
    });
  }
}
