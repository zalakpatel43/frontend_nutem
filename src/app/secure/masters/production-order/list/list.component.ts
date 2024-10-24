import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ProductionOrderService } from '../production-order.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/core/service/permission.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  // filteredProductionOrderData: any[] = [];
  filteredProductionOrderData = new MatTableDataSource<any>([]);
  columnsToDisplay: string[] = ['code', 'poNumber', 'poDateTimeFormatted', 'plannedQty', 'itemName', 'actions'];
  expandedElement: any | null = null;
  relatedData: any[] = [];
  searchData: { [key: string]: any } = {};
  statusOptions: string[] = ['Open', 'Closed']; // Dropdown options
  selectedStatus: string = 'Open';

  IsAddPemission: boolean = false;
  IsEditPermission: boolean = false;
  IsDeletePermission: boolean = false;
  customHeaders: { [key: string]: string } = {
    'code': 'Code',
    'poNumber': 'PO Number',
    'poDateTimeFormatted': 'Date',
    'plannedQty': 'Planned Quantity',
    'itemName': 'Item Name',
    'actions': 'Actions'
  };

  Childloading: boolean = false;
  isParentDataLoading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productionOrderService: ProductionOrderService,
    private notificationService: ToastrService, private router: Router,
    private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.IsAddPemission = this.permissionService.hasPermission('Production Order (PER_PURCHASEORDER) - Add');
    this.IsEditPermission = this.permissionService.hasPermission('Production Order (PER_PURCHASEORDER) - Edit');
    this.IsDeletePermission = this.permissionService.hasPermission('Production Order (PER_PURCHASEORDER) - Delete');
    this.getProductionOrderData();
  }
  getHeaderLabel(column: string): string {
    return this.customHeaders[column] || column; // Return custom header or fallback to column name
  }

  private getProductionOrderData(): void {
    this.filteredProductionOrderData.data = [];
    this.isParentDataLoading = true;
    this.productionOrderService.getPOByStatus(this.selectedStatus)
      .subscribe((result: any) => {
        this.productionOrderData = result;
        // console.log("ProductionOrderdata:",this.productionOrderData);

        this.filteredProductionOrderData.data = result;
        this.filteredProductionOrderData.paginator = this.paginator;
        this.isParentDataLoading = false;
        // this.filterByStatus();
        // .filter((list: any) => list.status == "Open")
      },
        (error) => {
          this.notificationService.error('Failed to load production orders.');
          this.isParentDataLoading = false;
        });
  }

  GetPOBystatus(): void {
    this.getProductionOrderData();
    // this.filteredProductionOrderData = this.productionOrderData.filter(order => order.status === this.selectedStatus);
  }

  toggleExpandRow(row: any) {
    if (this.expandedElement === row) {
      this.expandedElement = null; // Collapse if the same row is clicked
    } else {
      this.relatedData = [];
      this.Childloading = true;
      this.expandedElement = row; // Expand the clicked row
      this.productionOrderService.getByIdProductionOrder(row.id).subscribe((data: any) => {
        this.relatedData = this.getRelatedData(data);
        this.Childloading = false;
      }, (error) => {
        this.notificationService.error("Failed to load related data.");
      });
    }
  }

  toggleStatus(row: any) {
    const result = confirm(`Are you sure you want to chnage PO status?`);
    if (result) {
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

  }

  pageChanged(event: any) {
    // Handle page changes if necessary
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
        totalcaseproduced: ''
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
        totalcaseproduced: ''
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
        totalcaseproduced: ''
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
        totalcaseproduced: ''
      }));
    }

    // if (row.palletPackingList) {
    //   row.palletPackingList.forEach(item => relatedData.push({
    //     type: 'Pallet Packing List',
    //     id: item.id,
    //     code: item.code,
    //     date: item.packingDateTime,
    //     endDate: '',
    //     productName: item.productName,
    //     shiftName: ' ',
    //     totalcaseproduced:item.totalCasesProduced
    //   }));
    // }

    if (row.liquidPreparationList) {
      row.liquidPreparationList.forEach(item => relatedData.push({
        type: 'Liquid Preparation',
        id: item.id,
        code: item.code,
        date: item.startDateTime,
        endDate: item.endDateTime,
        productName: item.productName,
        shiftName: item.shiftName,
        totalcaseproduced: ''
      }));
    }

    if (row.downtimeTrackingList) {
      row.downtimeTrackingList.forEach(item => relatedData.push({
        type: 'Downtime Tracking',
        id: item.id,
        code: item.code,
        date: item.productionDateTime,
        endDate: '',
        productName: item.productName,
        shiftName: '',
        totalcaseproduced: ''
      }));
    }

    return relatedData;
  }

  editRelatedData(data: any): void {
    const navigateTo = (route: string) => {
      this.router.navigate([route]);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100); // Adjust the timeout as necessary
    };

    if (data.type === 'Weight Check') {
      navigateTo(`/secure/masters/weight-check/edit/${data.id}`);
      //  this.router.navigate(['/secure/masters/weight-check/edit', data.id]);
    } else if (data.type === 'Attribute Check') {
      this.router.navigate(['/secure/masters/attribute-check/edit', data.id]);
    } else if (data.type === 'Pre Check List') {
      this.router.navigate(['/secure/masters/pre-check/edit', data.id]);
    } else if (data.type === 'Post Check List') {
      this.router.navigate(['/secure/masters/post-check/edit', data.id]);
    } else if (data.type === 'Pallet Packing List') {
      this.router.navigate(['/secure/masters/pallet-packing/edit', data.id]);
    } else if (data.type === 'Liquid Preparation') {
      this.router.navigate(['/secure/masters/liquid-preparation/edit', data.id]);
    } else if (data.type === 'Downtime Tracking') {
      this.router.navigate(['/secure/masters/downtimeTracking/edit', data.id]);
    }
    else {
      console.error('Unknown type:', data.type);
    }


  }

  // Method to update search results based on emitted data from the search panel
  updateSearch(search: { [key: string]: any }) {
    this.searchData = { ...search };  // Store the search data

    // Filtering logic based on code, poNumber, and status
    this.filteredProductionOrderData.data = this.productionOrderData.filter(order => {
      const searchText = this.searchData.searchText ? this.searchData.searchText.toLowerCase() : '';
      const matchesCode = order.code.toLowerCase().includes(searchText);
      const matchesPONumber = order.poNumber.toLowerCase().includes(searchText);
      const matchesplannedQty = order.plannedQty.toString().includes(searchText);
      const matchesitemName = order.itemName.toLowerCase().includes(searchText);
      // const matchesDate = order.poDateTimeFormatted.toLowerCase()().includes(searchText);
      const formattedDate = new Date(order.poDateTimeFormatted).toLocaleDateString(); // You can customize the format as needed
      const matchesDate = formattedDate.includes(searchText);
      // Status filter (if isActive is checked, we apply that as well)
      const matchesStatus = this.searchData.isActive
        ? order.status.toLowerCase() === this.searchData.isActive.toLowerCase()
        : true;

      // Combine all search filters
      return (matchesCode || matchesPONumber || matchesplannedQty || matchesitemName || matchesDate) && matchesStatus;
    });
  }



}
