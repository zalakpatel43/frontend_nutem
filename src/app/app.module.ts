import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor, CoreModule, ResponseInterceptor } from '@app-core';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { ToastrModule } from 'ngx-toastr';
import { AppResolver } from './app-resolver.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { PublicModule } from './public/public.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    PublicModule,
    AppRoutingModule,
    // NgProgressModule,
    // NgProgressHttpModule,
    // NgProgressRouterModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      preventDuplicates: true,
    }),
    AgGridModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    AppService,
    AppResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
