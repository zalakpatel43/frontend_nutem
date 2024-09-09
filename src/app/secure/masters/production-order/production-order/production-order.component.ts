import { Component } from '@angular/core';

@Component({
  selector: 'app-production-order',
  templateUrl: './production-order.component.html',
// Fixed the name to plural
})
export class ProductionOrderComponent {
  // Add any TypeScript logic here if needed

  onSearchChanged(searchData: any) {
    // Handle search data changes, e.g., filter the list
    console.log('Search data:', searchData);
  }
}
