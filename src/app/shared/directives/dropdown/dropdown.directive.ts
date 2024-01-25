import { AfterViewInit, Directive, HostBinding } from '@angular/core';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { chevronDownIcon } from '@progress/kendo-svg-icons';

@Directive({
  selector: '[appDropdown]',
  standalone: true,
})
export class DropdownDirective implements AfterViewInit {
  // Class 'dropdown' is defined globally.
  @HostBinding('class') class = 'dropdown';

  constructor(private host: DropDownListComponent) {}

  ngAfterViewInit(): void {
    this.host.caretAltDownSVGIcon = chevronDownIcon;
  }
}
