import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrl: './tracking-map.component.scss',
})
export class TrackingMapComponent {
  map!: mapboxgl.Map;
}
