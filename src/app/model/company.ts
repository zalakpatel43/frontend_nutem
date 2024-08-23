import { DocumentDetails } from "./document-details";

export class Company {
    uniqueID: string;
    iD: number;
    companyName: string;
    alias?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    pincode?: string;
    city?: string;
    state?: string;
    country?: string;
    pANNo?: string;
    gSTNo?: string;
    emailID?: string;
    website?: string;
    currencyID?: number;
    companyCode?: string;
    stateName?: string;
    phoneNo?: string;
    companyLogoId: bigint;
    companyLogo: DocumentDetails;
    isActive: boolean;
    createdBy?: number;
    createdDate: Date;
    lastModifiedBy?: number;
    lastModifiedDate: Date;
}