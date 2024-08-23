import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType, UserAuthService } from '@app-core';
import { List, Location, LocationWarehouseDetail } from '@app-models';
import { LocationService } from '../location.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class LocationAddEditComponent implements OnInit, OnDestroy {
    frmLocation: UntypedFormGroup;
    locationData: Location;
    locationId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.location;
    permissions = PermissionType;
    error: string;
    companies: List[];
    states: List[];
    countries: List[];
    loggedInUserId: number;

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private locationService: LocationService,
        private notificationService: ToastrService, private listService: ListService,
        private authService: UserAuthService, private datePipe: DatePipe) {
        this.loggedInUserId = this.authService.getBrowserUser().id;
        this.createForm();
    }

    ngOnInit(): void {
        this.getLocationRoute();
        this.loadDropdowns();

        if (!this.isEditMode) {
            this.generateLocationCode();
        }
    }

    private createForm() {
        this.frmLocation = this.formBuilder.group({
            locationCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            locationName: ['', [Validators.required, Validators.maxLength(255)]],
            companyId: ['', [Validators.required]],
            addressLine1: ['', [Validators.required, Validators.maxLength(128)]],
            addressLine2: ['', [Validators.maxLength(128)]],
            addressLine3: ['', [Validators.maxLength(128)]],
            city: ['', [Validators.required, Validators.maxLength(128)]],
            stateId: ['', [Validators.required]],
            countryId: ['', [Validators.required]],
            pincode: ['', [Validators.required, Validators.maxLength(32)]],
            locationWarehouseDetails: this.formBuilder.array([])
        });
    }
    private generateLocationCode() {
        this.locationService.generateCode().subscribe((code: string) => {
            this.frmLocation.get('locationCode').setValue(code);
        });
    }

    get locationWarehouseDetails() {
        return this.frmLocation.get('locationWarehouseDetails') as UntypedFormArray;
    }

    private getLocationRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.locationId = +params["id"];
                this.getLocationDetails();
            }
        });
    }

    private getLocationDetails() {
        this.locationService.getById(this.locationId)
            .subscribe((result: Location) => {
                this.locationData = result;
                this.setLocationData(result);
            },
                (error) => {
                    this.error = error;
                });
    }

    private setLocationData(location: Location) {
        this.frmLocation.patchValue(location);

        if (location.locationWarehouseDetails) {
            location.locationWarehouseDetails.forEach((detail) => {
                this.addWarehouseDetail(detail);
            });
        }
    }

    addWarehouseDetail(detail?: LocationWarehouseDetail) {
        const control = this.locationWarehouseDetails;
        control.push(this.formBuilder.group({
            id: [detail ? detail.id : 0],
            warehouseName: [detail ? detail.warehouseName : '', [Validators.required, Validators.maxLength(255)]],
            addressLine1: [detail ? detail.addressLine1 : '', [Validators.required, Validators.maxLength(128)]],
            addressLine2: [detail ? detail.addressLine2 : '', [Validators.maxLength(128)]],
            addressLine3: [detail ? detail.addressLine3 : '', [Validators.maxLength(128)]],
            city: [detail ? detail.city : '', [Validators.required, Validators.maxLength(128)]],
            stateId: [detail ? detail.stateId : '', [Validators.required]],
            countryId: [detail ? detail.countryId : '', [Validators.required]],
            pincode: [detail ? detail.pincode : '', [Validators.required, Validators.maxLength(32)]]
        }));
    }

    removeWarehouseDetail(i: number) {
        const control = this.locationWarehouseDetails;
        control.removeAt(i);
    }

    private loadDropdowns() {
        this.listService.getList("companies")
            .subscribe((result: any[]) => {
                this.companies = result;
            });

        this.listService.getAllStates()
            .subscribe((data) => {
                this.states = data
            });

        this.listService.getCountries()
            .subscribe((data) => {
                this.countries = data
            });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmLocation.invalid) {
            return;
        }

        const locationData = this.frmLocation.getRawValue();

        if (locationData.locationWarehouseDetails.length === 0) {
            this.notificationService.warning("Please add at least one warehouse detail.");
            return;
        }

        if (this.isEditMode) {
            this.updateLocation(locationData);
        } else {
            this.createLocation(locationData);
        }
    }

    private createLocation(locationData: Location) {
        this.locationService.add(locationData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Location saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateLocation(locationData: Location) {
        this.locationService.update(this.locationId, locationData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Location updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}
