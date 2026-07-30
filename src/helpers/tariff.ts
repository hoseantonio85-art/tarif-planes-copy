import type {
  AppliedUserFilters,
  QuickFilter,
  RoleId,
  TariffUser,
  UserSearchDocument,
} from "@/@types/tariff";

const ROLE_PRIORITY: readonly RoleId[] = [
  "ORMCLOUD_RISKMANAGER",
  "ORMCLOUD_USER",
  "ORMCLOUD_COORDINATOR",
  "ORMCLOUD_ANALYST",
  "ORMCLOUD_AUDITOR",
];

export const USER_AVATAR_TONES = [
  "info",
  "success",
  "warning",
  "discovery",
  "danger",
  "brand",
] as const;

export type UserAvatarTone = (typeof USER_AVATAR_TONES)[number];

export const consumesPaidSlot = (user: TariffUser): boolean =>
  user.status === "active" && user.inTariff;

export const getActivePaidUsersCount = (users: TariffUser[]): number =>
  users.filter(consumesPaidSlot).length;

export const getActivationOutcome = (
  user: TariffUser,
  activePaidUsers: number,
  maxPaidUsers: number,
): "activate" | "limit" => {
  const activatedUser = { ...user, status: "active" as const };
  return consumesPaidSlot(activatedUser) && activePaidUsers >= maxPaidUsers
    ? "limit"
    : "activate";
};

export const updateUserStatus = (
  users: TariffUser[],
  userId: string,
  status: TariffUser["status"],
): TariffUser[] =>
  users.map((user) => (user.id === userId ? { ...user, status } : user));

export const getPrimaryRoleId = (user: TariffUser): RoleId =>
  ROLE_PRIORITY.find((roleId) => user.roleIds.includes(roleId)) ?? user.roleIds[0];

export const getUserInitials = (fullName: string): string =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("ru") ?? "")
    .join("");

export const getUserAvatarTone = (seed: string): UserAvatarTone => {
  const hash = Array.from(seed).reduce(
    (value, character) => (value * 31 + character.codePointAt(0)!) >>> 0,
    0,
  );
  return USER_AVATAR_TONES[hash % USER_AVATAR_TONES.length];
};

const parseRuDate = (value: string): Date => {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const isStaleUser = (
  user: TariffUser,
  nowIso: string,
  thresholdDays = 60,
): boolean => {
  const elapsed = new Date(nowIso).getTime() - parseRuDate(user.lastLogin).getTime();
  return elapsed > thresholdDays * 24 * 60 * 60 * 1000;
};

export const createUserSearchDocuments = (
  users: TariffUser[],
): UserSearchDocument[] =>
  users.map((user) => ({
    user,
    searchText: [user.fullName, user.email]
      .join(" ")
      .toLocaleLowerCase("ru"),
  }));

export const filterUsers = (
  documents: UserSearchDocument[],
  query: string,
  queryRoleIds: readonly RoleId[],
  quickFilter: QuickFilter,
  filters: AppliedUserFilters,
  nowIso: string,
): TariffUser[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");

  return documents
    .filter(({ user, searchText }) => {
      const matchesQuery =
        !normalizedQuery ||
        searchText.includes(normalizedQuery) ||
        user.roleIds.some((roleId) => queryRoleIds.includes(roleId));
      const matchesQuick =
        quickFilter === "all" ||
        (quickFilter === "in_tariff" && user.inTariff) ||
        (quickFilter === "out_of_tariff" && !user.inTariff);
      const matchesStatus = filters.status === "all" || user.status === filters.status;
      const matchesRole =
        filters.roleId === "all" || user.roleIds.includes(filters.roleId);
      const matchesStale = !filters.staleOnly || isStaleUser(user, nowIso);

      return matchesQuery && matchesQuick && matchesStatus && matchesRole && matchesStale;
    })
    .map(({ user }) => user);
};
