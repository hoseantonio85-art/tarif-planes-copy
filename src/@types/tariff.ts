export const ROLE_IDS = [
  "ORMCLOUD_RISKMANAGER",
  "ORMCLOUD_USER",
  "ORMCLOUD_COORDINATOR",
  "ORMCLOUD_ANALYST",
  "ORMCLOUD_AUDITOR",
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export type UserStatus = "active" | "deactivated";
export type QuickFilter = "all" | "in_tariff" | "out_of_tariff";
export type PermissionMode = "edit" | "view";
export type SystemAccessState =
  | "active"
  | "pending_provisioning"
  | "deactivated"
  | "provisioning_failed";

export type ModuleId = "risks" | "events" | "measures" | "analytics";

export interface ContractCompany {
  id: string;
  name: string;
  current?: boolean;
}

export interface TariffModule {
  id: ModuleId;
  name: string;
  description?: string;
  roleAvailable: boolean;
}

export interface TariffUser {
  id: string;
  fullName: string;
  email: string;
  roleIds: RoleId[];
  inTariff: boolean;
  status: UserStatus;
  lastLogin: string;
}

export interface TariffContract {
  tariffName: string;
  startsAt: string;
  endsAt: string;
  contractStatus: "active";
  contractNumber: string;
  maxPaidUsers: number;
  companies: ContractCompany[];
  modules: TariffModule[];
  users: TariffUser[];
}

export interface AppliedUserFilters {
  status: "all" | UserStatus;
  roleId: "all" | RoleId;
  staleOnly: boolean;
}

export interface UserSearchDocument {
  user: TariffUser;
  searchText: string;
}

export type FeedbackId =
  | "activated"
  | "deactivated"
  | "service_opened"
  | "support_requested"
  | "signed_out";
