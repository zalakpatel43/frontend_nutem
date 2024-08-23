import { BaseAuditable } from './base-auditable';
import { DocumentDetails } from './document-details';

export class Product extends BaseAuditable {
  id: number;
  productCode: string;
  productName: string;
  productGroupId: number | null;
  productGroup: string | null; // Added property
  productCategoryId: number;
  productCategory: string; // Added property
  productTypeId: number;
  productType: string; // Added property
  productBrandId: number | null;
  productBrand: string | null; // Added property
  productSizeId: number | null;
  productSize: string | null; // Added property
  hsnCode: string;
  productDescription: string;
  partCode: string | null;
  interStateTaxId: number;
  interStateTax: string; // Added property
  intraStateTaxId: number;
  intraStateTax: string; // Added property
  uomId: number;
  uom: string; // Added property
  productModelNumber: string | null;
  productImageId: number | null;
  productImage: DocumentDetails;
  productionCompletionDays: number;
}
