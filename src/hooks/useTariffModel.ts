import { useCallback, useMemo, useState } from "react";
import type {
  AppliedUserFilters,
  FeedbackId,
  PermissionMode,
  QuickFilter,
  RoleId,
  SystemAccessState,
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

type DialogState =
  | { kind: "deactivate"; userId: string }
  | null;

const getInitialScenario = () => {
  const params = new URLSearchParams(window.location.search);
  const access = params.get("access") as SystemAccessState | null;
  const scenario = params.get("scenario");

  return {
    accessState: access && ACCESS_STATES.includes(access) ? access : "active",
    permissionMode: params.get("permission") === "view" ? "view" : "edit",
    emptyUsers: scenario === "empty",
    isLoading: scenario === "loading",
    isRefreshing: scenario === "refreshing",
    limitReached: scenario === "limit",
  } satisfies {
    accessState: SystemAccessState;
    permissionMode: PermissionMode;
    emptyUsers: boolean;
    isLoading: boolean;
    isRefreshing: boolean;
    limitReached: boolean;
  };
};

export const useTariffModel = () => {
  const scenario = useMemo(getInitialScenario, []);
  const contract = useMemo(() => {
    const fixture = createTariffFixture(scenario.limitReached);
    return scenario.emptyUsers ? { ...fixture, users: [] } : fixture;
  }, [scenario.emptyUsers, scenario.limitReached]);
  const [users, setUsers] = useState(contract.users);
  const [accessState, setAccessState] = useState<SystemAccessState>(scenario.accessState);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [queryRoleIds, setQueryRoleIds] = useState<readonly RoleId[]>([]);
  const [draftFilters, setDraftFilters] = useState<AppliedUserFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<AppliedUserFilters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [limitWarning, setLimitWarning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackId | null>(null);

  const searchDocuments = useMemo(
    () => createUserSearchDocuments(users),
    [users],
  );
  const filteredUsers = useMemo(
    () =>
      filterUsers(
        searchDocuments,
        query,
        queryRoleIds,
        quickFilter,
        appliedFilters,
        SCENARIO_NOW,
      ),
    [appliedFilters, query, queryRoleIds, quickFilter, searchDocuments],
  );
  const activePaidUsers = useMemo(() => getActivePaidUsersCount(users), [users]);

  const toggleSearch = useCallback(() => setSearchOpen((current) => !current), []);
  const updateQuery = useCallback(
    (value: string, matchingRoleIds: readonly RoleId[]) => {
      setQuery(value);
      setQueryRoleIds(matchingRoleIds);
    },
    [],
  );
  const openFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setFilterOpen(true);
  }, [appliedFilters]);
  const closeFilters = useCallback(() => setFilterOpen(false), []);
  const resetFilters = useCallback(() => setDraftFilters(DEFAULT_FILTERS), []);
  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
  }, [draftFilters]);

  const requestUserStatusChange = useCallback(
    (userId: string) => {
      if (scenario.permissionMode === "view") return;
      const user = users.find((candidate) => candidate.id === userId);
      if (!user) return;

      if (user.status === "active") {
        setDialog({ kind: "deactivate", userId });
        return;
      }

      if (getActivationOutcome(user, activePaidUsers, contract.maxPaidUsers) === "limit") {
        setLimitWarning(true);
        return;
      }

      setUsers((current) => updateUserStatus(current, userId, "active"));
      setLimitWarning(false);
      setFeedback("activated");
    },
    [activePaidUsers, contract.maxPaidUsers, scenario.permissionMode, users],
  );

  const confirmDeactivation = useCallback(() => {
    if (dialog?.kind !== "deactivate") return;
    setUsers((current) => updateUserStatus(current, dialog.userId, "deactivated"));
    setDialog(null);
    setLimitWarning(false);
    setFeedback("deactivated");
  }, [dialog]);

  const closeDialog = useCallback(() => setDialog(null), []);
  const retryProvisioning = useCallback(() => setAccessState("active"), []);
  const showFeedback = useCallback((feedbackId: FeedbackId) => setFeedback(feedbackId), []);
  const clearFeedback = useCallback(() => setFeedback(null), []);
  const clearLimitWarning = useCallback(() => setLimitWarning(false), []);

  return {
    accessState,
    activePaidUsers,
    appliedFilters,
    applyFilters,
    clearFeedback,
    clearLimitWarning,
    closeDialog,
    closeFilters,
    confirmDeactivation,
    contract: { ...contract, users },
    dialog,
    draftFilters,
    feedback,
    filterOpen,
    filteredUsers,
    isLoading: scenario.isLoading,
    isRefreshing: scenario.isRefreshing,
    limitWarning,
    openFilters,
    permissionMode: scenario.permissionMode,
    query,
    quickFilter,
    requestUserStatusChange,
    resetFilters,
    retryProvisioning,
    roleIds: ROLE_IDS,
    searchOpen,
    setDraftFilters,
    setQuery: updateQuery,
    setQuickFilter,
    showFeedback,
    toggleSearch,
  };
};
