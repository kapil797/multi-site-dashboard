import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Third-party modules.
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IconsModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { MenusModule } from '@progress/kendo-angular-menu';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';

// Providers.
import { NotificationService } from '@progress/kendo-angular-notification';

// Directives.
import { OverlayDirective } from '@shared/directives/overlay/overlay.directive';
import { TabStripDirective } from '@shared/directives/tabstrip/tabstrip.directive';
import { ComponentDirective } from '@shared/directives/component/component.directive';

// Components.
import { IconTextButtonComponent } from '@shared/components/icon-text-button/icon-text-button.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { DropdownDirective } from '@shared/directives/dropdown/dropdown.directive';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';

@NgModule({
  declarations: [IconTextButtonComponent, NavbarComponent, SidebarComponent],
  imports: [
    // Modules.
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    DialogsModule,
    ButtonsModule,
    NavigationModule,
    LayoutModule,
    LabelModule,
    DropDownsModule,
    IconsModule,
    InputsModule,
    GridModule,
    IndicatorsModule,
    ToolBarModule,
    TreeViewModule,
    TooltipsModule,
    UploadsModule,
    MenusModule,
    PopupModule,
    ScrollViewModule,
    ProgressBarModule,

    // Directives.
    OverlayDirective,
    TabStripDirective,
    DropdownDirective,
    ComponentDirective,
  ],
  providers: [NotificationService],
  exports: [
    // Modules.
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    DialogsModule,
    ButtonsModule,
    NavigationModule,
    LayoutModule,
    LabelModule,
    DropDownsModule,
    IconsModule,
    InputsModule,
    GridModule,
    IndicatorsModule,
    ToolBarModule,
    TreeViewModule,
    TooltipsModule,
    UploadsModule,
    MenusModule,
    PopupModule,
    ScrollViewModule,
    ProgressBarModule,

    // Directives.
    OverlayDirective,
    TabStripDirective,
    DropdownDirective,
    ComponentDirective,

    // Components.
    IconTextButtonComponent,
    NavbarComponent,
    SidebarComponent,
  ],
})
export class SharedModule {}
