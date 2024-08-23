import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Product } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../product.service';

@Component({
    templateUrl: './list.component.html'
})
export class ProductListComponent implements OnInit {

    productData: Product[] = [];
    page: string = ApplicationPage.product;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private productService: ProductService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getProductData();
    }

    private getProductData() {
        this.loading = true;
        this.productService.get()
            .subscribe((result: Product[]) => {
                this.productData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleProduct(product: Product, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this product?`);
        if (result) {
            this.productService.toggleActivate(product.id, isActive)
                .subscribe(() => {
                    this.getProductData();
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
}
