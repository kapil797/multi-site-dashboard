import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { mapConstants } from '@core/constants/map.constant';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrl: './tracking-map.component.scss',
})
export class TrackingMapComponent implements OnInit, OnDestroy {
  @Input() height: number;
  @Input() bottomBar: boolean;
  //@Output() driverInfoEvent = new EventEmitter<Delivery[]>();
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v11';
  lat = 1.3541;
  lng = 103.811;
  //markers: MapMarker[] = [];

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  constructor() {}

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private initializeMap(): void {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      accessToken: mapConstants.MAP_ACCESS_TOKEN,
      container: 'map',
      style: this.style,
      zoom: 10,
      attributionControl: false,
      center: [this.lng, this.lat],
    });
    this.map.on('load', () => {
      this.setupMap();
      // this.fetchAndDisplayData();
    });
  }

  private setupMap(): void {
    // Any additional map setup, like adding controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  // private async fetchAndDisplayData(): Promise<void> {
  //   try {
  //     const tokenInfo = await this.dataService.getVehicleToken().toPromise();
  //     const deliveryData = await this.dataService.getDeliveryData(tokenInfo.token);

  //     // Process and display data
  //     this.displayRoutes(deliveryData.routes);
  //     this.displayMarkers(deliveryData.markers);

  //     // Emit event for parent components
  //     this.driverInfoEvent.emit(deliveryData.deliveries);
  //   } catch (error) {
  //     console.error('Error fetching logistic tracking data:', error);
  //   }
  // }

  // private displayRoutes(routes: Route[]): void {
  //   // Process and display routes on the map
  // }

  // private displayMarkers(markers: MapMarker[]): void {
  //   // Process and display markers on the map
  //   markers.forEach(marker => {
  //     // Create and add marker to map based on `marker.type`
  //   });
  // }
}
