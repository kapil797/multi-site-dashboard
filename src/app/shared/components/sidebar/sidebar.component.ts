import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar: ElementRef;
  @Input() header: string;
  @Input() rotate: string;

  ngAfterViewInit(): void {
    if (this.rotate === 'LEFT') this.sidebar.nativeElement.style.transform = 'rotate(180deg)';
  }
}
