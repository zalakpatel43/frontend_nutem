import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ProductionOrderService } from '../production-order.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductionOrderListComponent implements OnInit {

  productionOrderData: any[] = [];
  filteredProductionOrderData: any[] = [];
  columnsToDisplay: string[] = ['code', 'poNumber', 'poDateTimeFormatted', 'plannedQty', 'itemName', 'actions'];
  expandedElement: any | null = null;
  relatedData: any[] = [];
  searchData: { [key: string]: any } = {};
  statusOptions: string[] = ['Open', 'Closed']; // Dropdown options
  selectedStatus: string = 'Open';
  

  constructor(private productionOrderService: ProductionOrderService,
              private notificationService: ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.getProductionOrderData();
  }

  private getProductionOrderData(): void {
    this.productionOrderService.getProductionOrderList()
      .subscribe((result: any) => {
        this.productionOrderData = result; 
        this.filterByStatus();
        // .filter((list: any) => list.status == "Open")
      },
      (error) => {
        this.notificationService.error('Failed to load production orders.');
      });
  }

  filterByStatus(): void {
    this.filteredProductionOrderData = this.productionOrderData.filter(order => order.status === this.selectedStatus);
  }
  
  toggleExpandRow(row: any) {
    if (this.expandedElement === row) {
      this.expandedElement = null; // Collapse if the same row is clicked
    } else {
      this.expandedElement = row; // Expand the clicked row
      this.productionOrderService.getByIdProductionOrder(row.id).subscribe((data: any) => {
        this.relatedData = this.getRelatedData(data);
      }, (error) => {
        this.notificationService.error("Failed to load related data.");
      });
    }
  }

  toggleStatus(row: any) {
    this.productionOrderService.toggleProductionOrderStatus(row.id).subscribe(
      () => {
        // Update the status in the UI after the API call
        row.status = row.status === 'Open' ? 'Closed' : 'Open';
        this.notificationService.success(`Status updated successfully for Production Order: ${row.code}`);
        this.getProductionOrderData();
      },
      (error) => {
        this.notificationService.error(`Failed to update status for Production Order: ${row.code}`);
      }
    );
  }
  
  isRowExpanded(row: any): boolean {
    return this.expandedElement === row;
  }
  
  getRelatedData(row: any): any[] {
    const relatedData: any[] = [];

    if (row.weightChecks) {
      row.weightChecks.forEach(item => relatedData.push({
        type: 'Weight Check',
        id: item.id,
        code: item.code,
        date: item.startDateTime,
        endDate: item.endDateTime,
        productName: item.productName,
        shiftName: item.shiftName,
        totalcaseproduced:''
      }));
    }

    if (row.attributeChecks) {
      row.attributeChecks.forEach(item => relatedData.push({
        type: 'Attribute Check',
        id: item.id,
        code: item.code,
        date: item.acDate,
        endDate: '',
        productName: item.productName,
        shiftName: '',
        totalcaseproduced:''
      }));
    }

    if (row.preCheckListEntities) {
      row.preCheckListEntities.forEach(item => relatedData.push({
        type: 'Pre Check List',
        id: item.id,
        code: item.code,
        endDate: '',
        date: item.startDateTime,
        productName: item.productName,
        shiftName: item.shiftName,
        totalcaseproduced:''
      }));
    }

    if (row.postCheckListEntities) {
      row.postCheckListEntities.forEach(item => relatedData.push({
        type: 'Post Check List',
        id: item.id,
        code: item.code,
        date: item.endDateTime,
        endDate: '',
        productName: item.productName,
        shiftName: item.shiftName,
        totalcaseproduced:''
      }));
    }

    if (row.palletPackingList) {
      row.palletPackingList.forEach(item => relatedData.push({
        type: 'Pallet Packing List',
        id: item.id,
        code: item.code,
        date: item.packingDateTime,
        endDate: '',
        productName: item.productName,
        shiftName: ' ',
        totalcaseproduced:item.TotalCasesProduced
      }));
    }

    if (row.liquidPreparationList) {
      row.liquidPreparationList.forEach(item => relatedData.push({
        type: 'Liquid Preparation',
        id: item.id,
        code: item.code,
        date: item.startDateTime,
        endDate: item.endDateTime,
        productName: item.productName,
        shiftName: item.shiftName,
        totalcaseproduced:''
      }));
    }

    return relatedData;
  }

  editRelatedData(data: any): void {
    if (data.type === 'Weight Check') {
      this.router.navigate(['/secure/masters/weight-check/edit', data.id]);
    } else if (data.type === 'Attribute Check') {
      this.router.navigate(['/secure/masters/attribute-check/edit', data.id]);
    } else if (data.type === 'Pre Check List') {
      this.router.navigate(['/secure/masters/pre-check/edit', data.id]);
    } else if (data.type === 'Post Check List') {
      this.router.navigate(['/secure/masters/post-check/edit', data.id]);
    } else if (data.type === 'Pallet Packing List') {
      this.router.navigate(['/secure/masters/pallet-packing/edit', data.id]);
    } else {
      console.error('Unknown type:', data.type);
    }
  }

  updateSearch(search: { [key: string]: any }) {
    this.searchData = Object.assign({}, search);
  }
}
