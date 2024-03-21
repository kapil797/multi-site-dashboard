import * as mapboxgl from 'mapbox-gl';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { IconDefinition, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { LogisticTrackingService } from '@lt/logistic-tracking-service';
import { takeUntil, map } from 'rxjs';
import {
  Delivery,
  DeliveryDetail,
  // DeliveryDetail,
  EndPostalCode,
  MapToken,
  MarkerType,
  Point,
  Route,
  TrackingPostalCode,
  Vehicle,
} from '@lt/logistic-tracking-model';
import { AppService } from '@core/services/app.service';

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrl: './tracking-map.component.scss',
})
export class TrackingMapComponent extends CancelSubscription implements OnInit, OnDestroy {
  mapPin: IconDefinition = faMapPin;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v11';
  lat: number = 1.3541;
  lng: number = 103.811;
  routeApiRoot: string = 'https://api.mapbox.com/directions/v5/mapbox/cycling';
  color = ['red', 'orange', 'yellow', 'purple', 'violet', 'pink', '#006400', 'green', '#00ff00', 'black'];
  delivery: Delivery[] = [];
  @Output() driverInfoEvent = new EventEmitter();
  @Input() height: string;
  @ViewChild('map') private mapElement: ElementRef;

  constructor(
    private renderer: Renderer2,
    private app: AppService,
    private lt: LogisticTrackingService
  ) {
    super();
  }
  ngOnInit() {
    this.mapInitial();
    this.lt
      .fetchToken$(this.app.factory())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: MapToken) => {
          if (res.token) {
            this.loadMapInfos(res.token);
          }
        },
        error: err => {
          console.error('Failed to fetch token:', err);
        },
      });
  }
  mapInitial() {
    this.map = new mapboxgl.Map({
      accessToken: this.app.api.MAP_ACCESS_TOKEN,
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.lng, this.lat],
    });
    this.map.resize();
  }
  loadMapInfos(token: string) {
    this.lt
      .fetchTrackingVehicles$(this.app.factory(), token)
      .pipe(
        map(data => data as Vehicle[]) // Correctly map the incoming data to the Vehicle array
      )
      .subscribe(vehicles => {
        vehicles.forEach((vehicle, index) => {
          const startPostalCode = vehicle.StartAddressPostal;
          this.lt
            .fetchLogisticTrackingPostalCode$(this.app.factory(), startPostalCode)
            .pipe(
              map(res => {
                return {
                  id: res[0].id,
                  postal: res[0].postal,
                  lat: res[0].lat,
                  lon: res[0].lon,
                } as TrackingPostalCode;
              })
            )
            .subscribe((trackingPostalCode: TrackingPostalCode) => {
              this.lt.fetchLogisticTrackingEndPostalCode$(startPostalCode).subscribe(async (res: EndPostalCode[]) => {
                const route: Route = {
                  startPoint: {
                    title: `${vehicle.DriverUsername}(START)`,
                    description: `${vehicle.StartTime}`,
                    coordinates: [res[0].lon, res[0].lat],
                  },
                  endPoint: {
                    title: `${vehicle.DriverUsername}(END)`,
                    description: `${vehicle.EndTime}`,
                    coordinates: [trackingPostalCode.lon, trackingPostalCode.lat],
                  },
                  line_color: this.color[index],
                };
                this.addRoute(route);
              });
            });
        });
        this.lt.fetchLogisticTrackingJobs$().subscribe((res: DeliveryDetail[]) => {
          res.forEach(item => {
            this.addJobs([item.Lng, item.Lat], item.Status);
          });
          this.emitDriverInfoEvent(vehicles, res);
        });
      });

    this.map.resize();
  }
  async addRoute(route: Route) {
    const query = await fetch(this.routeApiGen(route.startPoint.coordinates, route.endPoint.coordinates), {
      method: 'GET',
    });
    console.log('query', query);
    const json = await query.json();
    const data = json.routes[0];
    const routeCoordinates = data.geometry.coordinates;

    const driverPoint: Point = {
      title: '',
      description: '',
      coordinates: routeCoordinates[Math.floor(routeCoordinates.length / 2)],
    };

    this.addMarker(driverPoint, MarkerType.driver);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoordinates,
      },
    };

    // Generate a truly unique ID for each route
    const uniqueRouteId = `route-${Date.now()}-${Math.random()}`;

    if (!this.map.getSource(uniqueRouteId)) {
      this.map.addSource(uniqueRouteId, {
        type: 'geojson',
        data: geojson,
      });

      this.map.addLayer({
        id: uniqueRouteId,
        type: 'line',
        source: uniqueRouteId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': route.line_color,
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }
  }
  routeApiGen(start: mapboxgl.LngLatLike, end: mapboxgl.LngLatLike) {
    const getLngLat = (lngLatLike: mapboxgl.LngLatLike): [number, number] => {
      if (Array.isArray(lngLatLike)) {
        // Assuming the tuple format [longitude, latitude]
        return lngLatLike;
      } else if ('lng' in lngLatLike && 'lat' in lngLatLike) {
        // Handles both LngLat and {lng, lat} object formats
        return [lngLatLike.lng, lngLatLike.lat];
      } else {
        // Default fallback, though this case should be covered above
        throw new Error('Invalid LngLatLike object');
      }
    };

    const [startLng, startLat] = getLngLat(start);
    const [endLng, endLat] = getLngLat(end);
    return (
      `${this.routeApiRoot}/${startLng},${startLat};${endLng},${endLat}` +
      `?steps=true&geometries=geojson&access_token=${this.app.api.MAP_ACCESS_TOKEN}`
    );
  }
  addMarker(point: Point, markerType: MarkerType) {
    const el = this.renderer.createElement('div');
    if (markerType != MarkerType.driver) {
      if (markerType == MarkerType.start) {
        this.renderer.addClass(el, 'marker-start');
      } else if (markerType == MarkerType.end) {
        this.renderer.addClass(el, 'marker-end');
      }
      // make a marker for each route and add it to the map
      new mapboxgl.Marker(el)
        .setLngLat(point.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<h3>${point.title}</h3><p>${point.description}</p>`)
        )
        .addTo(this.map);
    }
    // dirver icon
    else {
      this.renderer.addClass(el, 'marker-driver');
      new mapboxgl.Marker(el).setLngLat(point.coordinates).addTo(this.map);
    }
  }
  addJobs(coordinate: mapboxgl.LngLatLike, status: number) {
    let classname = '';
    switch (status) {
      case 1:
        classname = 'marker-pending';
        break;
      case 2:
        classname = 'marker-late';
        break;
      case 3:
        classname = 'marker-ontime';
        break;
      case 4:
        classname = 'marker-fail';
        break;
      case 5:
        classname = 'marker-expect-late';
        break;
      default:
        classname = 'marker-pending';
        break;
    }

    const el = this.renderer.createElement('div');
    this.renderer.addClass(el, 'marker');
    this.renderer.addClass(el, classname);

    new mapboxgl.Marker(el).setLngLat(coordinate).addTo(this.map);
  }
  emitDriverInfoEvent(vehicles: Vehicle[], jobs: DeliveryDetail[]) {
    vehicles.forEach(item => {
      // tabulate total and pending jobs for each driver
      const pending = jobs.filter(
        job => job.Status === 1 && job.DeliveryMaster && job.DeliveryMaster.VehicleId === item.Id
      );
      const others = jobs.filter(
        job => job.Status !== 1 && job.DeliveryMaster && job.DeliveryMaster.VehicleId === item.Id
      );

      const delivery: Delivery = {
        total: pending.length + others.length,
        pending: pending.length,
        driver: item.DriverUsername,
        percentage: (pending.length / (pending.length + others.length)) * 100,
        pickup: pending[0]?.ContactName,
      };
      this.delivery.push(delivery);
    });

    this.driverInfoEvent.emit(this.delivery);
  }
  override ngOnDestroy(): void {
    // Then, perform the map cleanup.
    super.ngOnDestroy();
    if (this.map) {
      this.mapElement.nativeElement.remove(); // This properly cleans up the Mapbox GL map instance
    }
  }
}
