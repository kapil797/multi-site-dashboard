import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-global-shopfloor-status1',
  templateUrl: './global-shopfloor-status1.component.html',
  styleUrl: './global-shopfloor-status1.component.scss',
})
export class GlobalShopfloorStatus1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  constructor(private http: HttpClient) {}
  // Method to test the API
  testApi(apiUrl: string): void {
    const mockDataUrl = 'assets/mock-data.json'; // Replace with your actual mock data URL

    this.http
      .get(apiUrl)
      .pipe(
        catchError(error => {
          console.error('API call failed, switching to mock data', error);
          return this.http.get(mockDataUrl); // Try to load mock data
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('API response:', response);
          this.handleApiResponse(response);
        } else {
          console.warn('No response from API or mock data');
        }
      });
  }

  // Method to handle the API or mock data response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleApiResponse(response: any): void {
    // Process the response data
    console.log('Processed response data:', response);
    // Example: Update the component's state or UI with the response data
    this.item = response;
  }
}
