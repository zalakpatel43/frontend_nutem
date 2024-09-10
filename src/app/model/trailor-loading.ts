export class TrailerLoading {
    id: number;
    code: string;
    tlDateTime: Date | null;
    doorNo: string;
    trailerNo: string;
    bolNo: string;
    supervisedBy: number | null;
    supervisedOn: Date | null;
}
export class TrailerLoadingDetails {
    headerId: number | null;
    productId: number | null;
    palletQty: number;
    productionOrder: string;
    actionTakenBy: number | null;
    isActive: boolean;

    // Optional: Add a reference to the parent `TrailerLoading` model if needed
    // trailerLoading?: TrailerLoading;
}
