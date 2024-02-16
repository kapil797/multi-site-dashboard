import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { Dialogs } from '@core/constants/dialogs.constant';
import { AppService } from '@core/services/app.service';
import { Dropdown } from '@shared/classes/form/form.class';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnChanges {
  /*
    Each navbar can have a maximum of two dropdowns.
    First dropdown will appear closest to the navigation icon.
  */
  @Input() header: string;
  @Input() dropdownOneLabel?: string;
  @Input() dropdownOne?: Dropdown[];
  @Input() dropdownTwoLabel?: string;
  @Input() dropdownTwo?: Dropdown[];
  @Output() toggleDropdownOne = new EventEmitter<unknown>();
  @Output() toggleDropdownTwo = new EventEmitter<unknown>();
  public tiles = 'assets/images/utilities/tiles.png';
  public dropdownOneValue: Dropdown;
  public dropdownTwoValue: Dropdown;

  constructor(private app: AppService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdownOne'] && this.dropdownOne && this.dropdownOne.length > 0) {
      this.dropdownOneValue = this.dropdownOne[0];
    }

    if (changes['dropdownTwo'] && this.dropdownTwo && this.dropdownTwo.length > 0) {
      this.dropdownTwoValue = this.dropdownTwo[0];
    }
  }

  public onOpenNavMenu() {
    this.app.appDialog = Dialogs.NAV_MENU;
  }

  public onChangeDropdownOne(event: Dropdown) {
    this.toggleDropdownOne.emit(event.value);
  }

  public onChangeDropdownTwo(event: Dropdown) {
    this.toggleDropdownTwo.emit(event.value);
  }
}
