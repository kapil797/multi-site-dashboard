import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '@core/models/multi-site.model';
import { FeatureService } from '@core/services/feature.service';
import { LayoutFiveComponent } from 'src/app/layouts/layout-five/layout-five.component';
import { LayoutFourComponent } from 'src/app/layouts/layout-four/layout-four.component';
import { LayoutOneComponent } from 'src/app/layouts/layout-one/layout-one.component';
import { LayoutSixComponent } from 'src/app/layouts/layout-six/layout-six.component';
import { LayoutThreeComponent } from 'src/app/layouts/layout-three/layout-three.component';
import { LayoutTwoComponent } from 'src/app/layouts/layout-two/layout-two.component';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrls: ['./multi-site.component.scss'], // Notice the correction from styleUrl to styleUrls
})
export class MultiSiteComponent implements AfterViewInit {
  @ViewChild('layoutHost', { read: ViewContainerRef }) layoutHost: ViewContainerRef;

  constructor(
    private featureService: FeatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.loadLayout();
    this.cdr.detectChanges();
  }

  loadLayout() {
    const layoutConfig = this.featureService.getLayoutWidgetsByFeature('logistic-tracking');
    if (!layoutConfig) return;

    const widgets: Widget[] = Object.keys(layoutConfig)
      .filter(key => key.startsWith('widget'))
      .map(key => layoutConfig[key] as Widget);

    const layoutId = layoutConfig.layoutId;
    const sideBarPosition = layoutConfig.sideBar?.position;
    const sideBarText = layoutConfig.sideBar?.text;
    console.log('layouthost', this.layoutHost);
    switch (layoutId) {
      case 1:
        // eslint-disable-next-line no-case-declarations
        const componentRefLayOne = this.layoutHost.createComponent(LayoutOneComponent);
        console.log('compnentRef', componentRefLayOne);
        componentRefLayOne.instance.widgets = widgets;
        componentRefLayOne.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLayOne.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      // handle other cases
      case 2:
        // eslint-disable-next-line no-case-declarations
        const componentRefLayTwo = this.layoutHost.createComponent(LayoutTwoComponent);
        console.log('compnentRef', componentRefLayTwo);
        componentRefLayTwo.instance.widgets = widgets;
        componentRefLayTwo.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLayTwo.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;

      case 3:
        // eslint-disable-next-line no-case-declarations
        const componentRefLayThree = this.layoutHost.createComponent(LayoutThreeComponent);
        console.log('compnentRef', componentRefLayThree);
        componentRefLayThree.instance.widgets = widgets;
        componentRefLayThree.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLayThree.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      case 4:
        // eslint-disable-next-line no-case-declarations
        const componentRefLayFour = this.layoutHost.createComponent(LayoutFourComponent);
        console.log('compnentRef', componentRefLayFour);
        componentRefLayFour.instance.widgets = widgets;
        componentRefLayFour.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLayFour.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      case 5:
        // eslint-disable-next-line no-case-declarations
        const componentRefLayFive = this.layoutHost.createComponent(LayoutFiveComponent);
        console.log('compnentRef', componentRefLayFive);
        componentRefLayFive.instance.widgets = widgets;
        componentRefLayFive.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLayFive.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      case 6:
        // eslint-disable-next-line no-case-declarations
        const componentRefLaySix = this.layoutHost.createComponent(LayoutSixComponent);
        console.log('compnentRef', componentRefLaySix);
        componentRefLaySix.instance.widgets = widgets;
        componentRefLaySix.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRefLaySix.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      // handle other cases
      default:
        return; // or throw an error, or load a default component
    }
  }
}
