import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { chartConfig } from '@core/models/charts.model';
import { GaugeRange } from '@core/models/gauge.model';
import { InventoryPerformance } from '@pi/production-and-inventory.model';

interface PerformanceGauge {
  title: string;
  text: string;
  value: number;
  maxValue: number;
  textColor: string;
  gaugeRange: GaugeRange[];
}

interface InlineStyles {
  text: CSSStyle;
  gauge: CSSStyle;
}

interface CSSStyle {
  fontSize?: string;
  width?: string;
  height?: string;
}

type Layer = 'LAYER1' | 'LAYER2';

enum Category {
  FILL_RATE = 'fillRate',
  TURNS = 'turns',
  VALUE = 'value',
}

@Component({
  selector: 'app-inventory-performance',
  templateUrl: './inventory-performance.component.html',
  styleUrl: './inventory-performance.component.scss',
})
export class InventoryPerformanceComponent implements OnInit, OnChanges {
  @Input() layer: Layer;
  @Input() data: InventoryPerformance;
  public gaugeData: PerformanceGauge[];
  public inlineStyles: InlineStyles;

  ngOnInit(): void {
    this.inlineStylesByLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.gaugeData = [];

      // Fill rate.
      this.gaugeData.push({
        title: 'Fill Rate',
        value: this.data.fillRate,
        maxValue: 100,
        text: this.formatValueByCategory(Category.FILL_RATE, this.data.fillRate),
        textColor: this.textColorByRange(Category.FILL_RATE, this.data.fillRate),
        gaugeRange: this.gaugeRangeByCategory(Category.FILL_RATE),
      });

      // Turns.
      this.gaugeData.push({
        title: 'Turns',
        value: this.data.turns,
        maxValue: 1,
        text: this.formatValueByCategory(Category.TURNS, this.data.turns),
        textColor: this.textColorByRange(Category.TURNS, this.data.turns),
        gaugeRange: this.gaugeRangeByCategory(Category.TURNS),
      });

      // Value.
      this.gaugeData.push({
        title: 'Value (SGD)',
        value: this.data.value,
        maxValue: 25000,
        text: this.formatValueByCategory(Category.VALUE, this.data.value),
        textColor: this.textColorByRange(Category.VALUE, this.data.value),
        gaugeRange: this.gaugeRangeByCategory(Category.VALUE),
      });
    }
  }

  private inlineStylesByLayer() {
    if (this.layer === 'LAYER1') {
      this.inlineStyles = {
        text: { fontSize: '2rem' },
        gauge: { width: '265px', height: '200px' },
      };
    } else {
      this.inlineStyles = {
        text: { fontSize: '1.25rem' },
        gauge: { width: '200px', height: '100px' },
      };
    }
  }

  private formatValueByCategory(category: string, v: number) {
    switch (category) {
      case Category.FILL_RATE:
        return `${v.toFixed(2)}%`;
      case Category.TURNS:
        return v.toFixed(2);
      case Category.VALUE:
        return `$${v}`;
      default:
        return '';
    }
  }

  private textColorByRange(category: string, v: number) {
    const gaugeRange = this.gaugeRangeByCategory(category);
    for (const gauge of gaugeRange) {
      if (v >= gauge.from && v <= gauge.to) return gauge.color;
    }
    return '';
  }

  private gaugeRangeByCategory(category: string) {
    switch (category) {
      case Category.FILL_RATE:
        return [
          { from: 0, to: 50, color: chartConfig.error },
          { from: 50, to: 80, color: chartConfig.warning },
          { from: 80, to: 100, color: chartConfig.success },
        ] as GaugeRange[];
      case Category.TURNS:
        return [
          { from: 0, to: 0.3, color: chartConfig.error },
          { from: 0.3, to: 0.5, color: chartConfig.warning },
          { from: 0.5, to: 1, color: chartConfig.success },
        ] as GaugeRange[];
      case Category.VALUE:
        return [
          { from: 0, to: 5000, color: chartConfig.error },
          { from: 5000, to: 10000, color: chartConfig.warning },
          { from: 10000, to: 15000, color: chartConfig.success },
          { from: 15000, to: 20000, color: chartConfig.warning },
          { from: 20000, to: 25000, color: chartConfig.error },
        ] as GaugeRange[];
      default:
        return [];
    }
  }
}
