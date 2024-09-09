import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ProductionOrderService } from '../production-order.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-production-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductionOrderListComponent implements OnInit {

  productionOrderData: any[] = [];
  page: string = ApplicationPage.productionOrder;
  permissions = PermissionType;
  error: string;
  loading: boolean;
  expandedRow: any = null;
  relatedData: any[] = [];
  expanded: any = {};  // To track expanded rows
  searchData: { [key: string]: any } = {};
row: any;

  constructor(private productionOrderService: ProductionOrderService,
              private notificationService: ToastrService) { }

  ngOnInit(): void {
    this.getProductionOrderData();
  }

  private getProductionOrderData() {
    this.loading = true;
    this.productionOrderService.getProductionOrderList()
      .subscribe((result: any) => {
        console.log("Production Order Data:", result);
        this.productionOrderData = result;
        this.loading = false;
      },
      (error) => {
        this.error = error;
        this.loading = false;
      });
  }
  

  toggleExpandRow(row: any) {
    console.log("PLUS",row);
    
    if (!row || !row.id) {
      console.error("Invalid row object or missing id");
      return;
    }
  
    if (this.expandedRow === row) {
      this.expandedRow = null; // Collapse if the same row is clicked
    } else {
      this.productionOrderService.getByIdProductionOrder(row.id).subscribe((data: any) => {
        this.expandedRow = row;
        this.relatedData = this.getRelatedData(data);
      }, (error) => {
        this.notificationService.error("Failed to load related data.");
      });
    }
  }
  
  isRowExpanded(row: any) {
    return this.expandedRow === row;
  }
  // Dynamically fetch related data for each row to be displayed in the nested table
  getRelatedData(row) {
    const relatedData = [];
    console.log("Sub-table:",relatedData);
    

    if (row.weightChecks) {
      row.weightChecks.forEach(item => relatedData.push({
        type: 'Weight Check',
        code: item.code,
        date: item.startDateTime,  // Handle date field for WeightCheck
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    if (row.attributeChecks) {
      row.attributeChecks.forEach(item => relatedData.push({
        type: 'Attribute Check',
        code: item.code,
        date: item.acDate,  // Handle date field for AttributeCheck
        productName: item.productName,
        shiftName: ''  // If shift name not available
      }));
    }

    if (row.preCheckListEntities) {
      row.preCheckListEntities.forEach(item => relatedData.push({
        type: 'Pre Check List',
        code: item.code,
        date: item.startDateTime,  // Handle date field for PreCheckListEntity
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    if (row.postCheckListEntities) {
      row.postCheckListEntities.forEach(item => relatedData.push({
        type: 'Post Check List',
        code: item.code,
        date: item.endDateTime,  // Handle date field for PostCheckListEntity
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    return relatedData;
  }
}
