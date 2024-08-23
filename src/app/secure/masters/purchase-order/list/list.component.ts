import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PurchaseOrder } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService } from '../purchase-order.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CustomDecimalPipe } from '@app-shared';

@Component({
    templateUrl: './list.component.html',
    providers: [DecimalPipe,DatePipe,CustomDecimalPipe]
})
export class PurchaseOrderListComponent implements OnInit {

    purchaseOrderData: PurchaseOrder[] = [];
    page: string = ApplicationPage.purchaseOrder;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private purchaseOrderService: PurchaseOrderService, 
        private notificationService: ToastrService,
        public datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getPurchaseOrderData();
    }

    private getPurchaseOrderData() {
        this.loading = true;
        this.purchaseOrderService.get()
            .subscribe((result: PurchaseOrder[]) => {
                this.purchaseOrderData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateTogglePurchaseOrder(purchaseOrder: PurchaseOrder, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this purchase order?`);
        if (result) {
            this.purchaseOrderService.toggleActivate(purchaseOrder.id, isActive)
                .subscribe(() => {
                    this.getPurchaseOrderData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }

    generatePdf(purchaseOrder: PurchaseOrder) {
        this.purchaseOrderService.getById(purchaseOrder.id).subscribe(data => {
            const doc = new jsPDF();

        // Adding Title and Meta Information
        doc.setFontSize(18);
        doc.text('Purchase Order', 14, 22);

        // Purchase Order Details
        doc.setFontSize(11);
        doc.text(`Purchase Order Code: ${data.purchaseOrderCode}`, 14, 30);
        doc.text(`Purchase Order Date: ${this.datePipe.transform(data.poDate, 'MM/dd/yyyy')}`, 14, 35);
        doc.text(`Vendor: ${data.vendorName}`, 14, 40);
        doc.text(`Vendor Address: ${data.vendorAddress}`, 14, 45);
        doc.text(`Vendor Contact: ${data.vendorContact}`, 14, 50);

        // Adding the table
        (doc as any).autoTable({
            head: [['Product Name', 'Drawing Number', 'Qty', 'Amount', 'Discount Amount', 'Total Amount']],
            body: data.purchaseOrderProductDetails.map(product => [
                product.productName,
                product.drawingNumber,
                product.qty,
                product.amount.toFixed(2),
                product.discountAmount.toFixed(2),
                ((product.qty * product.amount) - product.discountAmount).toFixed(2)
            ]),
            startY: 60
        });

        // Totals and Footer
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Total Product Amount: ${data.totalProductAmount.toFixed(2)}`, 14, finalY);
        doc.text(`Total Discount Amount: ${data.discountAmount.toFixed(2)}`, 14, finalY + 5);
        doc.text(`Total Tax Amount: ${data.totalTaxAmount.toFixed(2)}`, 14, finalY + 10);
        doc.text(`Total Amount: ${data.totalAmount.toFixed(2)}`, 14, finalY + 15);

        // Save the PDF
        doc.save(`purchase_order_${data.purchaseOrderCode}.pdf`);
    });
    }
}
