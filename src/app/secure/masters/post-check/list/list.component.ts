import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PostCheckService } from '../post-check.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'post-check-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PostCheckListComponent implements OnInit {

  postCheckData: any[] = [];
  page: string = ApplicationPage.postCheck;
  permissions = PermissionType;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {};

  constructor(private postCheckService: PostCheckService,
              private notificationService: ToastrService) { }

  ngOnInit(): void {
    this.getPostCheckData();
  }

  private getPostCheckData() {
    this.loading = true;

    this.postCheckService.getPostCheckList()
      .subscribe((result: any) => {
        this.postCheckData = result.filter((list: any) => list.isActive === true);
        
        this.loading = false;
      },
      (error) => {
        this.error = error;
        this.loading = false;
      });
  }

  removePostCheck(id: number) {
    const result = confirm(`Are you sure you want to delete this Post-Check?`);
    if (result) {
      this.postCheckService.deletePostCheck(id)
        .subscribe(() => {
          this.getPostCheckData();
        }, () => {
          this.notificationService.error("Something went wrong.");
        });
    }
  }

  updateSearch(search: { [key: string]: any }) {
    this.searchData = Object.assign({}, search);
  }
}
