import { BaseAuditable } from "./base-auditable";
import { Permission } from "./permission";

export class Role extends BaseAuditable {
    id: number;
    name: string;
    permissions: Permission[]
    assignedPermissions: any;
}