import { cast, type Instance, type SnapshotIn, types } from "mobx-state-tree";
import type {
  AppliedUserFilters,
  FeedbackId,
  PermissionMode,
  QuickFilter,
  RoleId,
  SystemAccessState,
  TariffContract,
  TariffCode,
  TariffUser,
} from "@/@types/tariff";
import { ROLE_IDS } from "@/@types/tariff";
import { createTariffFixture, SCENARIO_NOW } from "@/data/tariffFixtures";
import {
  createUserSearchDocuments,
  filterUsers,
  getActivationOutcome,
  getActivePaidUsersCount,
  updateUserStatus,
} from "@/helpers/tariff";

const DEFAULT_FILTERS: AppliedUserFilters = {
  status: "all",
  roleId: "all",
  staleOnly: false,
};

const ACCESS_STATES: SystemAccessState[] = [
  "active",
  "pending_provisioning",
  "deactivated",
  "provisioning_failed",
];

type TariffContractData = Omit<TariffContract, "users">;

export const TariffStore = types
  .model("TariffStore", {
    contractData: types.frozen<TariffContractData>(),
    users: types.array(types.frozen<TariffUser>()),
    accessState: types.enumeration<SystemAccessState>(ACCESS_STATES),
    permissionMode: types.enumeration<PermissionMode>(["edit", "view"]),
    isLoading: false,
    isRefreshing: false,
    quickFilter: types.optional(
      types.enumeration<QuickFilter>(["all", "in_tariff", "not_billable"]),
      "all",
    ),
    searchOpen: false,
    query: "",
    queryRoleIds: types.frozen<readonly RoleId[]>(),
    draftFilters: types.frozen<AppliedUserFilters>(),
    appliedFilters: types.frozen<AppliedUserFilters>(),
    filterOpen: false,
    dialogUserId: types.maybeNull(types.string),
    limitWarning: false,
    feedback: types.maybeNull(
      types.enumeration<FeedbackId>([
        "activated",
        "deactivated",
        "service_opened",
        "support_requested",
        "signed_out",
      ]),
    ),
  })
  .views((self) => ({
    get contract(): TariffContract {
      return {
        ...self.contractData,
        users: Array.from(self.users),
      };
    },
    get activePaidUsers(): number {
      return getActivePaidUsersCount(Array.from(self.users));
    },
    get filteredUsers(): TariffUser[] {
      return filterUsers(
        createUserSearchDocuments(Array.from(self.users)),
        self.query,
        self.queryRoleIds,
        self.quickFilter,
        self.appliedFilters,
        SCENARIO_NOW,
      );
    },
    get dialog(): { kind: "deactivate"; userId: string } | null {
      return self.dialogUserId
        ? { kind: "deactivate", userId: self.dialogUserId }
        : null;
    },
    get roleIds(): readonly RoleId[] {
      return ROLE_IDS;
    },
  }))
  .actions((self) => ({
    setQuickFilter(filter: QuickFilter) {
      self.quickFilter = filter;
    },
    toggleSearch() {
      self.searchOpen = !self.searchOpen;
    },
    setQuery(query: string, matchingRoleIds: readonly RoleId[]) {
      self.query = query;
      self.queryRoleIds = cast([...matchingRoleIds]);
    },
    openFilters() {
      self.draftFilters = cast({ ...self.appliedFilters });
      self.filterOpen = true;
    },
    closeFilters() {
      self.filterOpen = false;
    },
    resetFilters() {
      self.draftFilters = cast({ ...DEFAULT_FILTERS });
    },
    applyFilters() {
      self.appliedFilters = cast({ ...self.draftFilters });
      self.filterOpen = false;
    },
    setDraftStatus(status: AppliedUserFilters["status"]) {
      self.draftFilters = cast({ ...self.draftFilters, status });
    },
    setDraftRole(roleId: AppliedUserFilters["roleId"]) {
      self.draftFilters = cast({ ...self.draftFilters, roleId });
    },
    setDraftStale(staleOnly: boolean) {
      self.draftFilters = cast({ ...self.draftFilters, staleOnly });
    },
    requestUserStatusChange(userId: string) {
      if (self.permissionMode === "view") return;
      const users = Array.from(self.users);
      const user = users.find((candidate) => candidate.id === userId);
      if (!user) return;

      if (user.status === "active") {
        self.dialogUserId = userId;
        return;
      }

      const activePaidUsers = getActivePaidUsersCount(users);
      if (
        getActivationOutcome(user, activePaidUsers, self.contractData.maxPaidUsers) ===
        "limit"
      ) {
        self.limitWarning = true;
        return;
      }

      self.users.replace(updateUserStatus(users, userId, "active"));
      self.limitWarning = false;
      self.feedback = "activated";
    },
    confirmDeactivation() {
      if (!self.dialogUserId) return;
      self.users.replace(
        updateUserStatus(Array.from(self.users), self.dialogUserId, "deactivated"),
      );
      self.dialogUserId = null;
      self.limitWarning = false;
      self.feedback = "deactivated";
    },
    closeDialog() {
      self.dialogUserId = null;
    },
    retryProvisioning() {
      self.accessState = "active";
    },
    showFeedback(feedback: FeedbackId) {
      self.feedback = feedback;
    },
    clearFeedback() {
      self.feedback = null;
    },
    clearLimitWarning() {
      self.limitWarning = false;
    },
  }));

export type TariffStoreInstance = Instance<typeof TariffStore>;
export type TariffStoreSnapshot = SnapshotIn<typeof TariffStore>;

export const createInitialTariffStoreSnapshot = (
  search = "",
): TariffStoreSnapshot => {
  const params = new URLSearchParams(search);
  const requestedAccess = params.get("access") as SystemAccessState | null;
  const scenario = params.get("scenario");
  const limitReached = scenario === "limit";
  const tariffCode: TariffCode = params.get("tariff") === "premium" ? "premium" : "basic";
  const fixture = createTariffFixture(limitReached, tariffCode);
  const { users, ...contractData } = fixture;

  return {
    contractData,
    users: scenario === "empty" ? [] : users,
    accessState:
      requestedAccess && ACCESS_STATES.includes(requestedAccess)
        ? requestedAccess
        : "active",
    permissionMode: params.get("permission") === "view" ? "view" : "edit",
    isLoading: scenario === "loading",
    isRefreshing: scenario === "refreshing",
    queryRoleIds: [],
    draftFilters: DEFAULT_FILTERS,
    appliedFilters: DEFAULT_FILTERS,
  };
};

export const createTariffStore = (search = ""): TariffStoreInstance =>
  TariffStore.create(createInitialTariffStoreSnapshot(search));
