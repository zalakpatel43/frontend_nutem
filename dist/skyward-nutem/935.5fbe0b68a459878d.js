"use strict";(self.webpackChunkskyward_admin=self.webpackChunkskyward_admin||[]).push([[935],{1935:(U,g,s)=>{s.r(g),s.d(g,{BOMModule:()=>H});var F=s(71774),d=s(18498),t=s(54438);let b=(()=>{class o{constructor(){}static#t=this.\u0275fac=function(a){return new(a||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["ng-component"]],decls:1,vars:0,template:function(a,i){1&a&&t.nrm(0,"router-outlet")},dependencies:[d.n3],encapsulation:2})}return o})();var n=s(89417),r=s(4434);let p=(()=>{class o extends r.QP{constructor(e){super(e,"bom"),this._baseService=e}static#t=this.\u0275fac=function(a){return new(a||o)(t.KVO(r.dD))};static#e=this.\u0275prov=t.jDH({token:o,factory:o.\u0275fac})}return o})();var v=s(45794),B=s(60177),u=s(88834),M=s(32102),y=s(99631),O=s(99213),k=s(30220),j=s(58777),S=s(67133);function D(o,c){if(1&o){const e=t.RV6();t.j41(0,"a",27),t.bIt("click",function(){t.eBV(e);const i=t.XpG();return t.Njj(i.cancel())}),t.EFF(1," View List "),t.k0s()}}function E(o,c){if(1&o){const e=t.RV6();t.j41(0,"div",28)(1,"div",29)(2,"mat-form-field")(3,"mat-label"),t.EFF(4,"Raw Product Code"),t.k0s(),t.nrm(5,"input",30)(6,"mat-validation-message",14),t.k0s()(),t.j41(7,"div",29)(8,"mat-form-field")(9,"mat-label"),t.EFF(10,"Component Code"),t.k0s(),t.nrm(11,"input",31)(12,"mat-validation-message",14),t.k0s()(),t.j41(13,"div",32)(14,"mat-form-field")(15,"mat-label"),t.EFF(16,"Qty"),t.k0s(),t.nrm(17,"input",33)(18,"mat-validation-message",14),t.k0s()(),t.j41(19,"div",32)(20,"mat-form-field")(21,"mat-label"),t.EFF(22,"UOM"),t.k0s(),t.nrm(23,"input",34)(24,"mat-validation-message",14),t.k0s()(),t.j41(25,"div",35)(26,"button",36),t.bIt("click",function(){t.eBV(e);const i=t.XpG();return t.Njj(i.addDetail())}),t.j41(27,"mat-icon"),t.EFF(28,"add"),t.k0s()(),t.j41(29,"button",36),t.bIt("click",function(){const i=t.eBV(e).index,m=t.XpG();return t.Njj(m.removeDetail(i))}),t.j41(30,"mat-icon"),t.EFF(31,"delete"),t.k0s()()()()}if(2&o){const e=c.$implicit,a=c.index,i=t.XpG();t.Y8G("formGroupName",a),t.R7$(6),t.Y8G("control",e.get("rawProductCode"))("message","Raw Product Code")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",e.get("componentCode"))("message","Component Code")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",e.get("qty"))("message","Qty")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",e.get("uom"))("message","UOM")("formSubmitted",i.isFormSubmitted)}}let h=(()=>{class o{constructor(e,a,i,m,l){this.activatedRoute=e,this.router=a,this.formBuilder=i,this.bomService=m,this.notificationService=l,this.page=r.Wt.bom,this.permissions=r.eZ,this.createForm()}ngOnInit(){this.getBOMRoute()}getBOMRoute(){this.routerSub=this.activatedRoute.params.subscribe(e=>{this.isEditMode=!r.ov.isEmpty(e.id),this.createForm(),this.isEditMode&&(this.bomId=+e.id,this.getBOMDetails())})}getBOMDetails(){this.bomService.getById(this.bomId).subscribe(e=>{this.bomData=e,this.setBOMData()},e=>{console.log(e)})}setBOMData(){this.frmBOM.patchValue(this.bomData),this.setBOMDetails(this.bomData.details)}setBOMDetails(e){const a=this.frmBOM.get("details");e.forEach(i=>{a.push(this.formBuilder.group({rawProductCode:[i.rawProductCode,[n.k0.required,n.k0.maxLength(50)]],componentCode:[i.componentCode,[n.k0.required,n.k0.maxLength(50)]],qty:[i.qty,[n.k0.required]],uom:[i.uom,[n.k0.required,n.k0.maxLength(20)]]}))})}createForm(){this.frmBOM=this.formBuilder.group({bomCode:["",[n.k0.required,n.k0.maxLength(50)]],bomName:["",[n.k0.required,n.k0.maxLength(100)]],finishedProduct:["",[n.k0.required,n.k0.maxLength(100)]],baseQty:["",[n.k0.required]],remarks:["",[n.k0.maxLength(255)]],details:this.formBuilder.array([])})}get details(){return this.frmBOM.get("details")}addDetail(){const e=this.formBuilder.group({rawProductCode:["",[n.k0.required,n.k0.maxLength(50)]],componentCode:["",[n.k0.required,n.k0.maxLength(50)]],qty:["",[n.k0.required]],uom:["",[n.k0.required,n.k0.maxLength(20)]]});this.details.push(e)}removeDetail(e){this.details.removeAt(e)}createBOM(){this.bomService.add(this.frmBOM.value).subscribe(()=>{this.cancel(),this.notificationService.success("BOM saved successfully.")},a=>{this.error=a})}updateBOM(){this.bomData=Object.assign(this.bomData,this.bomData,this.frmBOM.value),this.bomService.update(this.bomData.id,this.bomData).subscribe(()=>{this.cancel(),this.notificationService.success("BOM updated successfully.")},a=>{this.error=a})}save(){this.isFormSubmitted=!0,!this.frmBOM.invalid&&(this.isEditMode?this.updateBOM():this.createBOM())}cancel(){this.router.navigate(this.isEditMode?["../..","list"]:["..","list"],{relativeTo:this.activatedRoute})}ngOnDestroy(){this.routerSub.unsubscribe()}static#t=this.\u0275fac=function(a){return new(a||o)(t.rXU(d.nX),t.rXU(d.Ix),t.rXU(n.ze),t.rXU(p),t.rXU(v.tw))};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["ng-component"]],decls:56,vars:18,consts:[["form","ngForm"],[1,"row","justify-content-center"],[1,"col-xl-11","col-lg-12"],[1,"border","p30","rounded"],[1,"row","align-items-center"],[1,"col-lg-7","col-sm-9","col-xs-10","d-flex","align-items-end","leftSideHeader"],[1,"mb20","float-left"],[1,"icon-edit"],[1,"col-lg-5","col-sm-3","col-xs-2","d-flex","justify-content-end","rightSideHeader","mb10"],["mat-flat-button","","color","primary","class","app-button",3,"click",4,"authPermission"],["novalidate","",1,"app-form",3,"submit","formGroup"],[1,"row"],[1,"col-md-4"],["type","text","matInput","","formControlName","bomCode"],[3,"control","message","formSubmitted"],["type","text","matInput","","formControlName","bomName"],["type","text","matInput","","formControlName","finishedProduct"],["type","number","matInput","","formControlName","baseQty"],[1,"col-md-8"],["type","text","matInput","","formControlName","remarks"],[1,"col-12"],[1,"mt-4"],["type","button","mat-flat-button","","color","primary",3,"click"],["formArrayName","details"],["class","row mt-3",3,"formGroupName",4,"ngFor","ngForOf"],[1,"col-lg-12","text-center"],["type","submit","mat-flat-button","","color","primary",1,"app-button","mr-1"],["mat-flat-button","","color","primary",1,"app-button",3,"click"],[1,"row","mt-3",3,"formGroupName"],[1,"col-md-3"],["type","text","matInput","","formControlName","rawProductCode"],["type","text","matInput","","formControlName","componentCode"],[1,"col-md-2"],["type","number","matInput","","formControlName","qty"],["type","text","matInput","","formControlName","uom"],[1,"col-md-2","d-flex","align-items-center"],["type","button","mat-icon-button","","color","warn",3,"click"]],template:function(a,i){if(1&a){const m=t.RV6();t.j41(0,"div",1)(1,"div",2)(2,"div",3)(3,"div",4)(4,"div",5)(5,"h4",6),t.nrm(6,"i",7),t.EFF(7," Add/Edit BOM"),t.k0s()(),t.j41(8,"div",8),t.DNE(9,D,2,0,"a",9),t.k0s()(),t.j41(10,"div")(11,"form",10,0),t.bIt("submit",function(){return t.eBV(m),t.Njj(i.save())}),t.j41(13,"div",11)(14,"div",12)(15,"mat-form-field")(16,"mat-label"),t.EFF(17,"BOM Code"),t.k0s(),t.nrm(18,"input",13)(19,"mat-validation-message",14),t.k0s()(),t.j41(20,"div",12)(21,"mat-form-field")(22,"mat-label"),t.EFF(23,"BOM Name"),t.k0s(),t.nrm(24,"input",15)(25,"mat-validation-message",14),t.k0s()(),t.j41(26,"div",12)(27,"mat-form-field")(28,"mat-label"),t.EFF(29,"Finished Product"),t.k0s(),t.nrm(30,"input",16)(31,"mat-validation-message",14),t.k0s()(),t.j41(32,"div",12)(33,"mat-form-field")(34,"mat-label"),t.EFF(35,"Base Qty"),t.k0s(),t.nrm(36,"input",17)(37,"mat-validation-message",14),t.k0s()(),t.j41(38,"div",18)(39,"mat-form-field")(40,"mat-label"),t.EFF(41,"Remarks"),t.k0s(),t.nrm(42,"input",19)(43,"mat-validation-message",14),t.k0s()()(),t.j41(44,"div",11)(45,"div",20)(46,"h5",21),t.EFF(47,"BOM Details"),t.k0s(),t.j41(48,"button",22),t.bIt("click",function(){return t.eBV(m),t.Njj(i.addDetail())}),t.EFF(49,"Add Detail"),t.k0s()()(),t.j41(50,"div",23),t.DNE(51,E,32,13,"div",24),t.k0s(),t.j41(52,"div",11)(53,"div",25)(54,"button",26),t.EFF(55,"Save"),t.k0s()()()()()()()()}2&a&&(t.R7$(9),t.Y8G("authPermission",i.page+"_"+i.permissions.list),t.R7$(2),t.Y8G("formGroup",i.frmBOM),t.R7$(8),t.Y8G("control",i.frmBOM.controls.bomCode)("message","BOM Code")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",i.frmBOM.controls.bomName)("message","BOM Name")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",i.frmBOM.controls.finishedProduct)("message","Finished Product")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",i.frmBOM.controls.baseQty)("message","Base Qty")("formSubmitted",i.isFormSubmitted),t.R7$(6),t.Y8G("control",i.frmBOM.controls.remarks)("message","Remarks")("formSubmitted",i.isFormSubmitted),t.R7$(8),t.Y8G("ngForOf",i.details.controls))},dependencies:[B.Sq,n.qT,n.me,n.Q0,n.BC,n.cb,n.j4,n.JD,n.$R,n.v8,u.It,u.$z,u.iY,M.rl,M.nJ,y.fg,O.An,k.B,j.T,S.r],encapsulation:2})}return o})();var f=s(33380),G=s(49239),x=s(74193);let _=(()=>{class o{constructor(){this.searchChanged=new t.bkB,this.searchData={},this.searchKey="bomCode,name,finishedProduct"}updateSearchTerms(e,a){this.searchData[e]=a,this.searchChanged.emit(this.searchData)}static#t=this.\u0275fac=function(a){return new(a||o)};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["bom-search-panel"]],outputs:{searchChanged:"searchChanged"},decls:5,vars:1,consts:[[1,"row"],[1,"col-lg-6"],[3,"textSearchEntered","placeHolder"],[1,"col-lg-4"],[3,"chkChanged"]],template:function(a,i){1&a&&(t.j41(0,"div",0)(1,"div",1)(2,"search-text",2),t.bIt("textSearchEntered",function(l){return i.updateSearchTerms(i.searchKey,l)}),t.k0s()(),t.j41(3,"div",3)(4,"search-inactive",4),t.bIt("chkChanged",function(l){return i.updateSearchTerms("isActive",l)}),t.k0s()()()),2&a&&(t.R7$(2),t.Y8G("placeHolder","Search BOM Code, Name, Finished Product"))},dependencies:[G.D,x.$],encapsulation:2})}return o})();var R=s(96081);const I=()=>({emptyMessage:"No Data to Display",totalMessage:"Total"}),N=()=>["../","add"],L=o=>["..","edit",o];function T(o,c){1&o&&(t.j41(0,"a",17)(1,"span"),t.EFF(2,"Add New"),t.k0s(),t.nrm(3,"i",18),t.k0s()),2&o&&t.Y8G("routerLink",t.lJ4(1,N))}function w(o,c){if(1&o&&(t.j41(0,"a",21)(1,"mat-icon"),t.EFF(2,"edit"),t.k0s()()),2&o){const e=t.XpG().row;t.Y8G("routerLink",t.eq3(1,L,e.id))}}function A(o,c){if(1&o){const e=t.RV6();t.j41(0,"a",24),t.bIt("click",function(){t.eBV(e);const i=t.XpG(2).row,m=t.XpG();return t.Njj(m.activateToggleBOM(i,!1))}),t.j41(1,"mat-icon"),t.EFF(2,"lock"),t.k0s()()}}function P(o,c){if(1&o){const e=t.RV6();t.j41(0,"a",24),t.bIt("click",function(){t.eBV(e);const i=t.XpG(2).row,m=t.XpG();return t.Njj(m.activateToggleBOM(i,!0))}),t.j41(1,"mat-icon"),t.EFF(2,"lock_open"),t.k0s()()}}function $(o,c){if(1&o&&(t.qex(0,22),t.DNE(1,A,3,0,"a",23)(2,P,3,0,"a",23),t.bVm()),2&o){const e=t.XpG().row;t.R7$(),t.Y8G("ngIf",e.isActive),t.R7$(),t.Y8G("ngIf",!e.isActive)}}function Y(o,c){if(1&o&&t.DNE(0,w,3,3,"a",19)(1,$,3,2,"ng-container",20),2&o){const e=t.XpG();t.Y8G("authPermission",e.page+"_"+e.permissions.edit),t.R7$(),t.Y8G("authPermission",e.page+"_"+e.permissions.active)}}const V=[{path:"",component:b,children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:(()=>{class o{constructor(e,a){this.bomService=e,this.notificationService=a,this.bomData=[],this.page=r.Wt.bom,this.permissions=r.eZ,this.searchData={isActive:!1}}ngOnInit(){this.getBOMData()}getBOMData(){this.loading=!0,this.bomService.get().subscribe(e=>{this.bomData=e,this.loading=!1},e=>{console.log(e),this.loading=!1})}activateToggleBOM(e,a){confirm(`Are you sure you want to ${a?"Activate":"Deactivate"} this BOM?`)&&this.bomService.toggleActivate(e.id,a).subscribe(()=>{this.getBOMData()},()=>{this.notificationService.error("Something went wrong.")})}updateSearch(e){this.searchData=Object.assign({},e)}isActiveRow(e){return{"text-danger":!e.isActive}}static#t=this.\u0275fac=function(a){return new(a||o)(t.rXU(p),t.rXU(v.tw))};static#e=this.\u0275cmp=t.VBU({type:o,selectors:[["ng-component"]],decls:19,vars:16,consts:[[1,"row","justify-content-center"],[1,"col-xl-11","col-lg-12"],[1,"border","p30","rounded"],[1,"row","align-items-center"],[1,"col-lg-7","col-sm-9","col-xs-10","d-flex","align-items-end","leftSideHeader"],[1,"mb20","float-left"],[1,"col-lg-5","col-sm-3","col-xs-2","d-flex","justify-content-end","rightSideHeader","mb10"],["mat-flat-button","","color","primary","class","app-button",3,"routerLink",4,"authPermission"],[1,"row"],[1,"col-12"],[3,"searchChanged"],[1,"material",3,"rows","columnMode","headerHeight","footerHeight","rowHeight","limit","loadingIndicator","scrollbarH","rowClass","messages"],["name","BOM Code","prop","bomCode"],["name","BOM Name","prop","bomName"],["name","Finished Product","prop","finishedProduct"],["name","Actions",3,"sortable"],["ngx-datatable-cell-template",""],["mat-flat-button","","color","primary",1,"app-button",3,"routerLink"],[1,"icon-plus"],["class","button-padding","color","primary",3,"routerLink",4,"authPermission"],["class","ml-10",4,"authPermission"],["color","primary",1,"button-padding",3,"routerLink"],[1,"ml-10"],["class","button-padding","color","primary",3,"click",4,"ngIf"],["color","primary",1,"button-padding",3,"click"]],template:function(a,i){1&a&&(t.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h4",5),t.EFF(6,"BOM List"),t.k0s()(),t.j41(7,"div",6),t.DNE(8,T,4,2,"a",7),t.k0s()(),t.j41(9,"div",8)(10,"div",9)(11,"bom-search-panel",10),t.bIt("searchChanged",function(l){return i.updateSearch(l)}),t.k0s(),t.j41(12,"ngx-datatable",11),t.nI1(13,"searchtable"),t.nrm(14,"ngx-datatable-column",12)(15,"ngx-datatable-column",13)(16,"ngx-datatable-column",14),t.j41(17,"ngx-datatable-column",15),t.DNE(18,Y,2,2,"ng-template",16),t.k0s()()()()()()()),2&a&&(t.R7$(8),t.Y8G("authPermission",i.page+"_"+i.permissions.create),t.R7$(4),t.Y8G("rows",t.i5U(13,12,i.bomData,i.searchData))("columnMode","force")("headerHeight",50)("footerHeight",50)("rowHeight","auto")("limit",10)("loadingIndicator",i.loading)("scrollbarH",!0)("rowClass",i.isActiveRow)("messages",t.lJ4(15,I)),t.R7$(5),t.Y8G("sortable",!1))},dependencies:[B.bT,u.It,O.An,d.Wk,f.ge,f.ed,f.QI,k.B,_,R.j],encapsulation:2})}return o})(),canActivate:[r.LL],data:{page:r.Wt.bom,action:r.eZ.list,title:"BOM"}},{path:"add",canActivate:[r.LL],data:{page:r.Wt.bom,action:r.eZ.create,title:"BOM"},component:h},{path:"edit/:id",canActivate:[r.LL],data:{page:r.Wt.bom,action:r.eZ.edit,title:"BOM"},component:h}]}];let X=(()=>{class o{static#t=this.\u0275fac=function(a){return new(a||o)};static#e=this.\u0275mod=t.$C({type:o});static#o=this.\u0275inj=t.G2t({imports:[d.iI.forChild(V),d.iI]})}return o})(),H=(()=>{class o{static#t=this.\u0275fac=function(a){return new(a||o)};static#e=this.\u0275mod=t.$C({type:o});static#o=this.\u0275inj=t.G2t({providers:[p],imports:[F.Gg,X]})}return o})()}}]);