import { environment } from "../../../environments/environment";

const serverPath = environment.serverPath;
const apiPath = serverPath + 'api/';
let basePath = apiPath;

export const APIConstant = {
    basePath: serverPath,

    //Upload
    upload: `${apiPath}Upload`,
    base64File: `${apiPath}upload/GetBase64FromURL`,

    //Login and Registration
    login: `${apiPath}account/login`,
    changepassword: `${apiPath}account/change-passwor`,
    logout: `${apiPath}account/logout`,
    groupcode: `${basePath}groupcode`,
    account: `${basePath}account`,
    role: `${basePath}role`,
    loginbytoken: `${apiPath}account/getuserloginbytoken`,
    modulegroup: `${basePath}modulegroup`,
    termsAndConditions: `${basePath}TermsAndConditions`,

    //WeightCheck
    weightcheckList: `${basePath}WeightCheck/GetAllWeightCheck`,
    weightcheckAdd: `${basePath}WeightCheck/AddWeighCheck`,
    weightcheckEdit: `${basePath}WeightCheck/EditWeighCheck`,
    weightcheckGetById: `${basePath}WeightCheck/GetByIdAsync`,
    weightcheckDelete: `${basePath}WeightCheck/DeleteWeightCheck`,

    //Nozzle
    NozzleList: `${basePath}NozzleMaster/GetAllNozzle`,  //WeightCHeck service 

    //ProductionOrder
    ProductionOrderList: `${basePath}ProductionOrder/GetAllProductionOrder`,  //WeightCHeck service 

     //Product
     ProductList: `${basePath}ProductMaster/GetAllProduct`,  //WeightCHeck service 

     //User
     UserList: `${basePath}users`,  //WeightCHeck service 

     //Shift
     ShiftList: `${basePath}ShiftMaster/GetAllShift`,  //WeightCHeck service 

    //Pages
    company: `${apiPath}company`,
    user: `${apiPath}users`,
    country: `${apiPath}country`,
    state: `${apiPath}state`,
    module: `${apiPath}module`,
    student:`${apiPath}Student`,
    bom: `${basePath}bommaster`,
    customer: `${basePath}customer`,
    product: `${basePath}product`,
    salesOrder: `${basePath}salesorder`,
    vendormaster: `${basePath}vendormaster`,
    workflow: `${basePath}workflow`,
    purchaseOrder: `${basePath}purchaseorder`,
    inventorytype: `${basePath}inventorytype`,
    inward: `${basePath}inward`,
    outward: `${basePath}outward`,
    qualityParameter: `${basePath}qualityparameter`,
    materialRequisition: `${basePath}materialrequisition`,
    location: `${basePath}location`,

    //List
    list: {
        modulePermission: `${apiPath}module`,
        role: `${apiPath}role/list`,
        town: `${basePath}parkingauthority/list`,
        onlinetheme: `${basePath}groupcode/list/onlinetheme`,
        locationgrouptype: `${basePath}groupcode/list/locationgrouptype`,
        authenticationtype: `${basePath}groupcode/list/authenticationtype`,
        groupnames: `${basePath}groupcode/groups`,
        names: `${basePath}groupcode/groupname`,
        types: `${apiPath}groupcode/list/types`,
        categories: `${apiPath}groupcode/list/categories`,
        customercategory: `${apiPath}groupcode/list/customercategory`,
        industries: `${apiPath}groupcode/list/industries`,
        sources: `${apiPath}groupcode/list/sources`,
        customertype: `${apiPath}groupcode/list/customertype`,
        territories: `${apiPath}groupcode/list/territories`,
        productGroups: `${apiPath}groupcode/list/productGroups`,
        productCategories: `${apiPath}groupcode/list/productCategories`,
        productTypes: `${apiPath}groupcode/list/productTypes`,
        productBrands: `${apiPath}groupcode/list/productBrands`,
        productSizes: `${apiPath}groupcode/list/productSizes`,
        interStateTaxes: `${apiPath}groupcode/list/interStateTaxes`,
        intraStateTaxes: `${apiPath}groupcode/list/intraStateTaxes`,
        uoms: `${apiPath}groupcode/list/uom`,
        customers: `${basePath}customer/list`,
        salesOrderTypes: `${apiPath}groupcode/list/salesOrderTypes`,
        currencies: `${apiPath}groupcode/list/currencies`,
        products: `${apiPath}product/list`,
        discountTypes: `${apiPath}groupcode/list/discountTypes`,
        productcategories: `${apiPath}groupcode/list/productcategories`,
        approvertypes: `${apiPath}groupcode/list/approvertypes`,
        vendors: `${apiPath}vendormaster/list`,
        approvalStatuses: `${apiPath}groupcode/list/approvalStatus`,
        termsConditions: `${basePath}TermsAndConditions/list`,
        finishedproducts: `${apiPath}product/finishedProducts`,
        qcparameters: `${apiPath}groupcode/list/qcparameters`,
        qcclasses: `${apiPath}groupcode/list/qcclasses`,
        lslDimensions: `${apiPath}groupcode/list/lslDimensions`,
        uslDimensions: `${apiPath}groupcode/list/uslDimensions`,
        measuringInstruments: `${apiPath}groupcode/list/measuringInstruments`,
        sampleFrequencies: `${apiPath}groupcode/list/sampleFrequencies`,
        reportingFrequencies: `${apiPath}groupcode/list/reportingFrequencies`,
        warehouses: `${apiPath}location/warehouses`,
        rawmaterialProducts: `${apiPath}product/rawmaterialProducts`,
        companies: `${apiPath}company/company`,
    },
}

export const PublicAPI = [
    APIConstant.login, APIConstant.loginbytoken
]