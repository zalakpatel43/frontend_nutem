import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCheckComponent } from './post-check/post-check.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PostCheckListComponent } from './list/list.component';
import { PostCheckAddEditComponent } from './add-edit/add-edit.component';
import { PostCheckSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
    path: '',
    component: PostCheckComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: PostCheckListComponent,
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.postCheck, title: 'PostCheck' }
      },
      {
        path: 'add',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.postCheck, title: 'PostCheck' },
        component: PostCheckAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.postCheck, title: 'PostCheck' },
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
