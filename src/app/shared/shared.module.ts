import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
    ValidationMessage, FormServerErrorComponent, SearchTextComponent, SearchNumberComponent,
    SearchInActiveComponent, ConfirmationBoxComponent, ConfirmationBoxService,
    TruncateTextComponent, MatValidationMessage, AlertBoxComponent
} from './components';
import {
    ClickOutsideDirective, HrefPreventDefaultDirective, ImagePreviewDirective, AuthPermissionDirective,
    ButtonNoDblClickDirective, LimitToDirective, ImageFallbackDirective, LowercaseDirective, SpaceRestrictDirective
} from './directives';
import { SearchTablePipe, ObjectToArrayPipe, SafePipe, HTMLSanitizePipe, AccountNumberPipe, VehicleInfoPipe, CustomDecimalPipe } from './pipes';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaskDirective,NgxMaskPipe } from 'ngx-mask';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatModule } from './mat.module';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { PublicService } from '../public/public.service';
import { UserAuthService } from '../core/service';
// import { FileUploadModule } from 'ng2-file-upload';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FilePreviewModalComponent } from './components/file-preview-modal/file-preview-modal.component';

const sharedModule = [
    CommonModule, FormsModule, ReactiveFormsModule, MatModule,
    RouterModule, NgxDatatableModule, NgSelectModule,NgxMaskDirective,NgxMaskPipe
];

const sharedDirectives = [
    ClickOutsideDirective, HrefPreventDefaultDirective, ImagePreviewDirective, AuthPermissionDirective,
    ButtonNoDblClickDirective, LimitToDirective, ImageFallbackDirective, LowercaseDirective,
    SpaceRestrictDirective, AuthPermissionDirective
];

const entryComponents = [ConfirmationBoxComponent, AlertBoxComponent, FilePreviewModalComponent];

const sharedPipes = [
    SearchTablePipe, ObjectToArrayPipe, SafePipe, HTMLSanitizePipe, AccountNumberPipe, VehicleInfoPipe, CustomDecimalPipe,
];

const sharedServices = [ConfirmationBoxService, DatePipe, PublicService, UserAuthService];

const sharedComponents = [
    ValidationMessage, FormServerErrorComponent, SearchTextComponent,
    SearchNumberComponent, SearchInActiveComponent,
    TruncateTextComponent, MatValidationMessage, FileUploaderComponent
];

@NgModule({
    imports: [
        ...sharedModule,
        ModalModule.forRoot(),
        TruncateModule,
        
    ],
    declarations: [
        ...sharedDirectives,
        ...sharedComponents,
        ...sharedPipes,
        ...entryComponents
    ],
    exports: [
        ...sharedModule,
        ...sharedDirectives,
        ...sharedComponents,
        ...sharedPipes
    ],
    providers: [
        ...sharedServices
    ]
})
export class SharedModule { }
