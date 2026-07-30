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

export type ModuleId =
  | "risks"
  | "events"
  | "measures"
  | "ai_assessment"
  | "behavior_risks"
  | "analytics"
  | "counterparties"
  | "ai_monitoring"
  | "limit_campaign"
  | "knowledge_base";

export interface ContractCompany {
  id: string;
  name: string;
  current?: boolean;
}

export interface TariffModule {
  id: ModuleId;
  name: string;
  description: string;
  includedInContract: boolean;
  roleAvailable: boolean;
}

export interface TariffUser {
  id: string;
  fullName: string;
  email: string;
  roleIds: RoleId[];
  status: UserStatus;
  lastLogin: string;
}

export interface TariffContract {
  description: string;
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
