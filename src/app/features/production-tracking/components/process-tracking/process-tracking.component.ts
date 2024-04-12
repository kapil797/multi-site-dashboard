import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { ProcessTrackingMap, ProcessTrackingItem } from '@pt/production-tracking.model';

interface SvgLine {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Hexagon extends ProcessTrackingItem {
  htmlId: string;
}

@Component({
  selector: 'app-process-tracking',
  templateUrl: './process-tracking.component.html',
  styleUrl: './process-tracking.component.scss',
})
export class ProcessTrackingComponent implements OnChanges {
  /*
    Width needs to be fixed and responsive must be disabled.
    Else, the hexagons and connecting lines will be jumbled up.

    Indexing of rows and cols is 0-based.
  */
  @ViewChild('grid') grid: ElementRef;
  @Input() data?: ProcessTrackingMap;
  @Output() toggle = new EventEmitter<number>();
  public icon = faEllipsis;
  public gridItems: Hexagon[][];
  public svgLines: SvgLine[];
  private width = 5; // Need to match in CSS file.
  private marginOffset = 1;
  private current: HTMLDivElement;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.resetAndConstructCanvas();
    }
  }

  private resetAndConstructCanvas() {
    if (!this.data) return;

    const connectingItems: string[][] = [];
    this.initGridItems(this.data.rows, this.data.cols);
    this.populateRequiredHexagons(connectingItems);

    // TODO: auto emit the current item

    setTimeout(() => {
      // To run after DOM has been initialized.
      // Set grid columns.
      const el = this.grid.nativeElement as HTMLDivElement;
      el.style.gridTemplateColumns = `repeat(${this.data?.cols}, ${this.width - this.marginOffset}rem)`;
      // Draw lines.
      this.drawConnectingLines(connectingItems);
      this.toggleProcessOnInit();
    }, 1);
  }

  private initGridItems(rows: number, cols: number) {
    // Cols and rows are swapped here.
    this.gridItems = [];
    for (let i = 0; i < cols; i++) {
      const temp: Hexagon[] = [];
      for (let j = 0; j < rows; j++) {
        const sentinel: Hexagon = {
          id: -1,
          processCode: '',
          row: j,
          col: i,
          text: '',
          htmlId: this.formatHtmlId(j, i),
        };
        temp.push(sentinel);
      }
      this.gridItems.push(temp);
    }
  }

  private populateRequiredHexagons(connectingItems: string[][]) {
    if (!this.data) return;
    // Cols and rows are swapped here.
    for (const item of this.data.items) {
      const hexagon = this.gridItems[item.col][item.row];
      hexagon.htmlId = this.formatHtmlId(item.row, item.col);
      hexagon.id = item.id;
      hexagon.text = item.text;
      hexagon.statusId = item.statusId;
      hexagon.processCode = item.processCode;
      hexagon.processId = item.processId;

      // Check if need to draw connecting lines.
      if (item.toId) {
        const toEl = this.data.items.find(row => row.id === item.toId);
        if (!toEl) return;
        connectingItems.push([hexagon.htmlId, this.formatHtmlId(toEl.row, toEl.col)]);
      }
    }
  }

  private drawConnectingLines(connectingItems: string[][]) {
    // [[fromId, toId], [fromId, toId]]
    this.svgLines = [];
    for (const row of connectingItems) {
      const fromElCoordinates = this.getCenterCoordinates(row[0]);
      const toElCoordinates = this.getCenterCoordinates(row[1]);
      const temp: SvgLine = {
        x1: fromElCoordinates[0],
        y1: fromElCoordinates[1],
        x2: toElCoordinates[0],
        y2: toElCoordinates[1],
      };
      this.svgLines.push(temp);
    }
  }

  private getCenterCoordinates(htmlId: string) {
    // Coordinates are relative to grid container.
    // Box-sizing must be set to border-box.
    const el = document.getElementById(htmlId);
    if (!el) return [];
    const elRect = el.getBoundingClientRect();
    const x = el.offsetLeft + elRect.width / 2;
    const y = el.offsetTop + elRect.height / 2;
    return [x, y];
  }

  private formatHtmlId(row: number, col: number) {
    return `hexagon-${row}-${col}`;
  }

  private toggleProcessOnInit() {
    // Toggle in-progress if any, else the last completed process.
    let item: Hexagon | null = null;

    for (const col of this.gridItems) {
      for (const row of col) {
        if (!item) {
          item = row;
        } else if (row.statusId === 3) {
          // In progress.
          item = row;
          break;
        } else if (row.statusId === 4) {
          // Completed.
          item = row;
        }
      }
    }
    if (!item) return;
    const el = document.getElementById(item.htmlId) as HTMLDivElement;
    if (!el) return;
    el.classList.add('selected');
    this.current = el;
    this.toggle.emit(item.processId);
  }

  public onToggleProcess(event: HTMLDivElement, item: Hexagon) {
    if (this.current) this.current.classList.remove('selected');
    event.classList.add('selected');
    this.current = event;
    this.toggle.emit(item.processId || 10000);
  }

  public getHexStatusClass(statusId?: number) {
    switch (statusId) {
      case 3:
        return 'ongoing';
      case 4:
        return 'completed';
      default:
        return '';
    }
  }
}
