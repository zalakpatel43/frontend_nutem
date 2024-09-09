import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ProductionOrderService } from '../production-order.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  columnsToDisplay: string[] = ['code', 'poNumber', 'poDateTimeFormatted', 'plannedQty', 'itemName', 'actions'];
  expandedElement: any | null = null;
  relatedData: any[] = [];
  searchData: { [key: string]: any } = {};

  constructor(private productionOrderService: ProductionOrderService,
              private notificationService: ToastrService) { }

  ngOnInit(): void {
    this.getProductionOrderData();
  }

  private getProductionOrderData(): void {
    this.productionOrderService.getProductionOrderList()
      .subscribe((result: any) => {
        this.productionOrderData = result;
      },
      (error) => {
        this.notificationService.error('Failed to load production orders.');
      });
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
  
  isRowExpanded(row: any): boolean {
    return this.expandedElement === row;
  }
  
  getRelatedData(row: any): any[] {
    const relatedData: any[] = [];

    if (row.weightChecks) {
      row.weightChecks.forEach(item => relatedData.push({
        type: 'Weight Check',
        code: item.code,
        date: item.startDateTime,
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    if (row.attributeChecks) {
      row.attributeChecks.forEach(item => relatedData.push({
        type: 'Attribute Check',
        code: item.code,
        date: item.acDate,
        productName: item.productName,
        shiftName: ''
      }));
    }

    if (row.preCheckListEntities) {
      row.preCheckListEntities.forEach(item => relatedData.push({
        type: 'Pre Check List',
        code: item.code,
        date: item.startDateTime,
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    if (row.postCheckListEntities) {
      row.postCheckListEntities.forEach(item => relatedData.push({
        type: 'Post Check List',
        code: item.code,
        date: item.endDateTime,
        productName: item.productName,
        shiftName: item.shiftName
      }));
    }

    return relatedData;
  }
}
