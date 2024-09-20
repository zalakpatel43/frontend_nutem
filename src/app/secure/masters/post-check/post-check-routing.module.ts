import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCheckComponent } from './post-check/post-check.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PostCheckListComponent } from './list/list.component';
import { PostCheckAddEditComponent } from './add-edit/add-edit.component';
import { PostCheckSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PostCheckComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: PostCheckListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'PostCheck List (PER_POSTCHEKLIST) - View' },
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'PostCheck List (PER_POSTCHEKLIST) - Add' },
        component: PostCheckAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'PostCheck List (PER_POSTCHEKLIST) - Edit' },
        component: PostCheckAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostCheckRoutingModule { }

export const PostCheckComponents = [
  PostCheckSearchPanelComponent, PostCheckComponent, PostCheckListComponent, PostCheckAddEditComponent
];
