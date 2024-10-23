export class PalletPacking {
    id: number;
    code: string;
    startDateTime: Date;
    productId: number;
    productName: string;
    productionOrderId: number;
    poNumber:string;
    sapProductionOrderId:number;
    packingDateTime:Date;

    fillerUserIds: string;
    comments: string;
    isActive: boolean;
}
