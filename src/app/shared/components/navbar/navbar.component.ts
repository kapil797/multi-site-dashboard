import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { Dialogs } from '@core/constants/dialogs.constant';
import { AppService } from '@core/services/app.service';

export interface DropdownData {
  data: string[];
  label: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  /*
    Each navbar can have a maximum of two dropdowns.
    First dropdown will appear closest to the navigation icon.
  */
  @Input() header: string;
  @Input() dropdownOne: DropdownData;
  @Input() dropdownTwo: DropdownData;
  @Output() selectDropdownOne = new EventEmitter<string>();
  @Output() selectDropdownTwo = new EventEmitter<string>();
  public tiles = 'assets/images/utilities/tiles.png';
  public dropdownOneValue: string;
  public dropdownTwoValue: string;

  constructor(private app: AppService) {}

  ngOnInit(): void {
    if (this.dropdownOne) this.dropdownOneValue = this.dropdownOne.data[0];
    if (this.dropdownTwo) this.dropdownTwoValue = this.dropdownTwo.data[0];
  }

  public onOpenNavMenu() {
    this.app.appDialog = Dialogs.NAV_MENU;
  }
}
