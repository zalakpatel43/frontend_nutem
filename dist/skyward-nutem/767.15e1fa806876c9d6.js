"use strict";(self.webpackChunkskyward_nutem=self.webpackChunkskyward_nutem||[]).push([[767],{4767:(Y,b,r)=>{r.r(b),r.d(b,{RoleModule:()=>$});var w=r(1774),p=r(177),d=r(8498),e=r(4438);let C=(()=>{class o{static#e=this.\u0275fac=function(s){return new(s||o)};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ng-component"]],decls:1,vars:0,template:function(s,i){1&s&&e.nrm(0,"router-outlet")},dependencies:[d.n3],encapsulation:2})}return o})();var c=r(9417),l=r(4434),u=r(2558),E=r(5794),g=r(8834),y=r(2765),v=r(2102),S=r(9631),F=r(8777);function T(o,m){1&o&&(e.j41(0,"mat-error"),e.EFF(1," Role Name is required. "),e.k0s())}function j(o,m){if(1&o&&(e.j41(0,"tr")(1,"td"),e.EFF(2),e.k0s(),e.j41(3,"td"),e.nrm(4,"mat-checkbox",25),e.k0s(),e.j41(5,"td"),e.nrm(6,"mat-checkbox",25),e.k0s(),e.j41(7,"td"),e.nrm(8,"mat-checkbox",25),e.k0s(),e.j41(9,"td"),e.nrm(10,"mat-checkbox",25),e.k0s()()),2&o){const t=m.$implicit;e.R7$(2),e.JRh(t.get("permission").value),e.R7$(2),e.Y8G("formControl",t.get("view")),e.R7$(2),e.Y8G("formControl",t.get("add")),e.R7$(2),e.Y8G("formControl",t.get("edit")),e.R7$(2),e.Y8G("formControl",t.get("delete"))}}let R=(()=>{class o{constructor(t,s,i,a,n){this.activatedRoute=t,this.router=s,this.formBuilder=i,this.roleService=a,this.notificationService=n,this.page=l.Wt.role,this.Permissions=[{permission:"Dashboard",view:!1,add:!1,edit:!1,delete:!1},{permission:"User",view:!1,add:!1,edit:!1,delete:!1},{permission:"Role",view:!1,add:!1,edit:!1,delete:!1},{permission:"Weight Check",view:!1,add:!1,edit:!1,delete:!1},{permission:"Attribute Check",view:!1,add:!1,edit:!1,delete:!1},{permission:"PreCheck List",view:!1,add:!1,edit:!1,delete:!1},{permission:"PostCheck List",view:!1,add:!1,edit:!1,delete:!1},{permission:"Liquid Preparation",view:!1,add:!1,edit:!1,delete:!1},{permission:"Trailer Inspection",view:!1,add:!1,edit:!1,delete:!1},{permission:"Pallet Packing",view:!1,add:!1,edit:!1,delete:!1},{permission:"DownTime Tracking",view:!1,add:!1,edit:!1,delete:!1},{permission:"Production Order",view:!1,add:!1,edit:!1,delete:!1}],this.createForm()}ngOnInit(){this.getRoleRoute(),this.getPermissionDetails()}getRoleRoute(){this.routerSub=this.activatedRoute.params.subscribe(t=>{this.isEditMode=!l.ov.isEmpty(t.id),this.isEditMode&&(this.roleId=+t.id,this.getRoleDetails())})}getPermissionDetails(){this.roleService.getPermission(this.permissionId).subscribe(t=>{if(this.PermissionData=t,console.log("Permission Data:",this.PermissionData),this.roleData){const s=this.transformPermissionsEdit(this.roleData.rolePermissions,this.PermissionData);this.setRoleData(s)}},t=>{console.error(t),this.notificationService.error("Error fetching permission details: "+t.message)})}getRoleDetails(){this.roleService.getRoleById(this.roleId).subscribe(t=>{if(this.roleData=t,console.log("Role Data:",this.roleData),this.roleData&&this.PermissionData){const s=this.transformPermissionsEdit(this.roleData.rolePermissions,this.PermissionData);this.setRoleData(s)}},t=>{console.error(t),this.notificationService.error("Error fetching role details: "+t.message)})}createForm(){this.frmRole=this.formBuilder.group({name:["",[c.k0.required,c.k0.maxLength(100)]],Permissions:this.formBuilder.array(this.Permissions.map(t=>this.createPermissionGroup(t)))})}transformPermissionsEdit(t,s){const i=new Map;s.forEach(n=>{i.set(n.id,{name:n.name,type:n.permissionTypeId})}),console.log("Permission Map:",Array.from(i.entries()));const a=this.Permissions.map(n=>({...n,view:!1,add:!1,edit:!1,delete:!1}));return t.forEach(n=>{const P=i.get(n.permissionId);if(P){const h=a.find(W=>W.permission===P.name);if(h)switch(P.type){case 72:h.add=!0;break;case 73:h.edit=!0;break;case 74:h.view=!0;break;case 75:h.delete=!0}}}),console.log("Transformed Permissions:",a),a}setRoleData(t){this.frmRole.patchValue({name:this.roleData.name});const s=this.frmRole.get("Permissions");s.clear(),t.forEach(i=>{s.push(this.formBuilder.group({permission:[i.permission],view:[i.view],add:[i.add],edit:[i.edit],delete:[i.delete]}))}),console.log(this.frmRole.value)}createRole(){const t=this.frmRole.value,s=this.transformPermissions(t.Permissions),i={id:0,name:t.name,Permissions:s,rolePermissions:s,assignedPermissions:[],NormalizedName:t.name.toUpperCase()};this.roleService.addRole(i).subscribe(()=>{this.cancel(),this.notificationService.success("Role created successfully.")},a=>{this.error=a,this.notificationService.error("Error creating role: "+a.message)})}createPermissionGroup(t){return this.formBuilder.group({permission:[t.permission],view:[t.view],add:[t.add],edit:[t.edit],delete:[t.delete]})}updateRole(){const t=this.frmRole.value,s=this.transformPermissions(t.Permissions),i={...this.roleData,name:t.name,Permissions:s,NormalizedName:t.name.toUpperCase()};this.roleService.updateRole(this.roleData.id,i).subscribe(()=>{this.cancel(),this.notificationService.success("Role updated successfully.")},a=>{this.error=a,this.notificationService.error("Error updating role: "+a.message)})}transformPermissions(t){return t.map(s=>({Code:this.mapPermissionToCode(s.permission),IsList:s.view,IsAdd:s.add,IsEdit:s.edit,IsDelete:s.delete,IsExport:!1}))}mapPermissionToCode(t){return{Dashboard:"PER_DASHBOARD",User:"PER_USER",Role:"PER_ROLE","Weight Check":"PER_WEIGHTCHECK","Attribute Check":"PER_ATTRIBUTECHECK","PreCheck List":"PER_PRECHEKLIST","Liquid Preparation":"PER_LIQUIDPREPARATION","Trailer Inspection":"PER_TRAILERINSPECTION","PostCheck List":"PER_POSTCHEKLIST","DownTime Tracking":"PER_DOWNTIMECHECKING","Pallet Packing":"PER_PALLETPACKING","Production Order":"PER_PURCHASEORDER"}[t]||"UNKNOWN_CODE"}save(){this.isFormSubmitted=!0,this.frmRole.invalid?this.notificationService.error("Please fill all required fields."):this.isEditMode?this.updateRole():this.createRole()}cancel(){this.router.navigate(this.isEditMode?["../..","list"]:["..","list"],{relativeTo:this.activatedRoute})}ngOnDestroy(){this.routerSub&&this.routerSub.unsubscribe()}static#e=this.\u0275fac=function(s){return new(s||o)(e.rXU(d.nX),e.rXU(d.Ix),e.rXU(c.ze),e.rXU(u.W),e.rXU(E.tw))};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ng-component"]],decls:50,vars:3,consts:[["form","ngForm"],[1,"row","justify-content-center"],[1,"col-xl-11","col-lg-12"],[1,"border","p30","rounded"],[1,"row","align-items-center","mb-4"],[1,"col-lg-7","col-sm-9","col-xs-10","d-flex","align-items-end"],[1,"mb-0"],[1,"icon-edit"],[1,"col-lg-5","col-sm-3","col-xs-2","d-flex","justify-content-end"],["mat-flat-button","","color","primary",1,"app-button",3,"click"],["novalidate","",1,"app-form",3,"ngSubmit","formGroup"],[1,"card","mb-4"],[1,"card-header"],[1,"card-body"],[1,"row"],[1,"col-12","col-sm-6","col-md-4","mb-3"],["appearance","fill",1,"full-width"],["matInput","","formControlName","name"],[4,"ngIf"],[1,"table-responsive"],[1,"table","table-hover","table-bordered"],[1,"bg-primary","text-white","text-center"],[4,"ngFor","ngForOf"],[1,"col-lg-12","text-center"],["type","submit","mat-flat-button","","color","primary",1,"app-button","mr-1"],[3,"formControl"]],template:function(s,i){if(1&s){const a=e.RV6();e.j41(0,"div",1)(1,"div",2)(2,"div",3)(3,"div",4)(4,"div",5)(5,"h4",6),e.nrm(6,"i",7),e.EFF(7," Add/Edit Role"),e.k0s()(),e.j41(8,"div",8)(9,"a",9),e.bIt("click",function(){return e.eBV(a),e.Njj(i.cancel())}),e.EFF(10," View List "),e.k0s()()(),e.j41(11,"form",10,0),e.bIt("ngSubmit",function(){return e.eBV(a),e.Njj(i.save())}),e.j41(13,"div",11)(14,"div",12)(15,"h5",6),e.EFF(16,"Role Details"),e.k0s()(),e.j41(17,"div",13)(18,"div",14)(19,"div",15)(20,"mat-form-field",16)(21,"mat-label"),e.EFF(22,"Role Name"),e.k0s(),e.nrm(23,"input",17),e.DNE(24,T,2,0,"mat-error",18),e.k0s()()()()(),e.j41(25,"div",11)(26,"div",12)(27,"h5",6),e.EFF(28,"Permissions"),e.k0s()(),e.j41(29,"div",13)(30,"div",19)(31,"table",20)(32,"thead",21)(33,"tr")(34,"th"),e.EFF(35,"Permission"),e.k0s(),e.j41(36,"th"),e.EFF(37,"View"),e.k0s(),e.j41(38,"th"),e.EFF(39,"Add"),e.k0s(),e.j41(40,"th"),e.EFF(41,"Edit"),e.k0s(),e.j41(42,"th"),e.EFF(43,"Delete"),e.k0s()()(),e.j41(44,"tbody"),e.DNE(45,j,11,5,"tr",22),e.k0s()()()()(),e.j41(46,"div",14)(47,"div",23)(48,"button",24),e.EFF(49,"Save"),e.k0s()()()()()()()}2&s&&(e.R7$(11),e.Y8G("formGroup",i.frmRole),e.R7$(13),e.Y8G("ngIf",i.frmRole.get("name").invalid&&(i.frmRole.get("name").touched||i.isFormSubmitted)),e.R7$(21),e.Y8G("ngForOf",i.frmRole.get("Permissions").controls))},dependencies:[p.Sq,p.bT,c.qT,c.me,c.BC,c.cb,c.l_,c.j4,c.JD,g.It,g.$z,y.So,v.rl,v.nJ,v.TL,S.fg,F.T],styles:[".permissions-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}.permissions-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .permissions-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{text-align:center;vertical-align:middle;padding:8px}.permissions-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background-color:#007bff;color:#fff;font-weight:700}.permissions-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{background-color:#f9f9f9}.permissions-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   mat-checkbox[_ngcontent-%COMP%]{margin:auto}.permissions-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#f2f2f2}.permissions-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover{background-color:#e9ecef}.card[_ngcontent-%COMP%]{margin-bottom:1.5rem;box-shadow:0 1px 3px #0000001a}.card-header[_ngcontent-%COMP%]{background-color:#f8f9fa;border-bottom:1px solid #e9ecef;padding:.75rem 1.25rem}.card-body[_ngcontent-%COMP%]{padding:1.25rem}.mat-icon[_ngcontent-%COMP%]{vertical-align:middle}.full-width[_ngcontent-%COMP%]{width:100%}.mb-3[_ngcontent-%COMP%]{margin-bottom:1rem}"]})}return o})();var I=r(9213),f=r(3380),M=r(220),O=r(9239);let k=(()=>{class o{constructor(){this.searchChanged=new e.bkB,this.searchData={},this.searchKey="name"}updateSearchTerms(t,s){this.searchData[t]=s,this.searchChanged.emit(this.searchData)}static#e=this.\u0275fac=function(s){return new(s||o)};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["role-search-panel"]],outputs:{searchChanged:"searchChanged"},decls:3,vars:1,consts:[[1,"row"],[1,"col-lg-6"],[3,"textSearchEntered","placeHolder"]],template:function(s,i){1&s&&(e.j41(0,"div",0)(1,"div",1)(2,"search-text",2),e.bIt("textSearchEntered",function(n){return i.updateSearchTerms(i.searchKey,n)}),e.k0s()()()),2&s&&(e.R7$(2),e.Y8G("placeHolder","Search Role"))},dependencies:[O.D],encapsulation:2})}return o})();const _=()=>({emptyMessage:"No Data to Display",totalMessage:"Total"}),L=()=>["../","add"],x=o=>["..","edit",o];function A(o,m){1&o&&(e.j41(0,"a",15)(1,"span"),e.EFF(2,"Add New"),e.k0s(),e.nrm(3,"i",16),e.k0s()),2&o&&e.Y8G("routerLink",e.lJ4(1,L))}function G(o,m){if(1&o&&(e.j41(0,"a",19)(1,"mat-icon"),e.EFF(2,"edit"),e.k0s()()),2&o){const t=e.XpG().row;e.Y8G("routerLink",e.eq3(1,x,t.id))}}function N(o,m){if(1&o){const t=e.RV6();e.DNE(0,G,3,3,"a",17),e.j41(1,"button",18),e.bIt("click",function(){const i=e.eBV(t).row,a=e.XpG();return e.Njj(a.removeRole(i.id))}),e.j41(2,"mat-icon"),e.EFF(3,"close"),e.k0s()()}if(2&o){const t=e.XpG();e.Y8G("authPermission",t.page+"_"+t.permissions.edit)}}const H=[{path:"",component:C,children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:(()=>{class o{activateToggleRole(t,s){throw new Error("Method not implemented.")}constructor(t,s){this.roleService=t,this.notificationService=s,this.roleData=[],this.page=l.Wt.role,this.permissions=l.eZ,this.searchData={isActive:!1}}ngOnInit(){this.getRoleData()}getRoleData(){this.loading=!0,this.roleService.getRole().subscribe(t=>{this.roleData=t,this.loading=!1},t=>{console.log(t),this.loading=!1})}removeRole(t){confirm("Are you sure, you want to delete this role?")&&this.roleService.deleteRole(t).subscribe(()=>{this.getRoleData()},()=>{this.notificationService.error("Something went wrong.")})}updateSearch(t){this.searchData=Object.assign({},t)}isActiveRow(t){return{"text-dark":!t.isActive}}static#e=this.\u0275fac=function(s){return new(s||o)(e.rXU(u.W),e.rXU(E.tw))};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ng-component"]],decls:16,vars:13,consts:[[1,"row","justify-content-center"],[1,"col-xl-11","col-lg-12"],[1,"border","p30","rounded"],[1,"row","align-items-center"],[1,"col-lg-7","col-sm-9","col-xs-10","d-flex","align-items-end","leftSideHeader"],[1,"mb20","float-left"],[1,"col-lg-5","col-sm-3","col-xs-2","d-flex","justify-content-end","rightSideHeader","mb10"],["mat-flat-button","","color","primary","class","app-button",3,"routerLink",4,"authPermission"],[1,"row"],[1,"col-12"],[3,"searchChanged"],[1,"material",3,"rows","columnMode","headerHeight","footerHeight","rowHeight","limit","loadingIndicator","scrollbarH","rowClass","messages"],["name","Role","prop","name"],["name","Actions",3,"sortable"],["ngx-datatable-cell-template",""],["mat-flat-button","","color","primary",1,"app-button",3,"routerLink"],[1,"icon-plus"],[3,"routerLink",4,"authPermission"],["type","button",2,"border","none","background-color","white","color","red",3,"click"],[3,"routerLink"]],template:function(s,i){1&s&&(e.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h4",5),e.EFF(6,"Role List"),e.k0s()(),e.j41(7,"div",6),e.DNE(8,A,4,2,"a",7),e.k0s()(),e.j41(9,"div",8)(10,"div",9)(11,"role-search-panel",10),e.bIt("searchChanged",function(n){return i.updateSearch(n)}),e.k0s(),e.j41(12,"ngx-datatable",11),e.nrm(13,"ngx-datatable-column",12),e.j41(14,"ngx-datatable-column",13),e.DNE(15,N,4,1,"ng-template",14),e.k0s()()()()()()()),2&s&&(e.R7$(8),e.Y8G("authPermission",i.page+"_"+i.permissions.create),e.R7$(4),e.Y8G("rows",i.roleData)("columnMode","force")("headerHeight",50)("footerHeight",50)("rowHeight","auto")("limit",10)("loadingIndicator",i.loading)("scrollbarH",!0)("rowClass",i.isActiveRow)("messages",e.lJ4(12,_)),e.R7$(2),e.Y8G("sortable",!1))},dependencies:[g.It,I.An,d.Wk,f.ge,f.ed,f.QI,M.B,k],encapsulation:2})}return o})(),canActivate:[l.LL],data:{page:l.Wt.role,action:l.eZ.list,title:"Role"}},{path:"add",canActivate:[l.LL],data:{page:l.Wt.role,action:l.eZ.create,title:"Role"},component:R},{path:"edit/:id",canActivate:[l.LL],data:{page:l.Wt.role,action:l.eZ.edit,title:"Role"},component:R}]}];let U=(()=>{class o{static#e=this.\u0275fac=function(s){return new(s||o)};static#t=this.\u0275mod=e.$C({type:o});static#s=this.\u0275inj=e.G2t({imports:[d.iI.forChild(H),d.iI]})}return o})();var B=r(9830);let $=(()=>{class o{static#e=this.\u0275fac=function(s){return new(s||o)};static#t=this.\u0275mod=e.$C({type:o});static#s=this.\u0275inj=e.G2t({providers:[u.W,(0,B._c)()],imports:[w.Gg,U,p.MD,f.Kj]})}return o})()}}]);