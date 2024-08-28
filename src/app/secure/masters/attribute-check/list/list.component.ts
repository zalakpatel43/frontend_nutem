import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { AttributeCheckService } from '../attribute-check.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  // standalone: true,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class AttributeCheckListComponent implements OnInit {

  attributeCheckData: any[] = [];
  page: string = ApplicationPage.attributeCheck;
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {
     // isActive: false
  };

  constructor(private attributeCheckService: AttributeCheckService,
      private notificationService: ToastrService) { }

  ngOnInit(): void {
      this.getattributeCheckData();
  }

  private getattributeCheckData() {
      this.loading = true;

      this.attributeCheckService.getAttributeCheckList()
          .subscribe((result: any) => {
              // this.cancel();
              this.attributeCheckData = result;
              console.log("attribute check list", this.attributeCheckData);
              this.loading = false;
          },
              (error) => {
                  this.error = error;
                  this.loading = false;
              });
  }

  removeWeightCheck(id:number) {
      const result = confirm(`Are you sure, you want to delete this Attribute Check?`);
      if (result) {
          this.attributeCheckService.DeleteAttributeCheck(id)
              .subscribe(() => {
                  this.getattributeCheckData();
              }, () => {
                  this.notificationService.error("Something went wrong.");
              });
      }
  }

  updateSearch(search: { [key: string]: any }) {
      this.searchData = Object.assign({}, search);
      console.log("serach data", this.searchData);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }

 
}
