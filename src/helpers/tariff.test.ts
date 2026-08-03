import { describe, expect, it } from "vitest";
import type { AppliedUserFilters, TariffUser } from "@/@types/tariff";
import { createTariffFixture } from "@/data/tariffFixtures";
import {
  createUserSearchDocuments,
  filterUsers,
  getActivationOutcome,
  getActivePaidUsersCount,
  getUserAvatarTone,
  getPrimaryRoleId,
  getUserInitials,
  isPaidUser,
  isStaleUser,
  updateUserStatus,
} from "@/helpers/tariff";

const users: TariffUser[] = [
  {
    id: "risk-manager",
    fullName: "Кузнецова Анна Сергеевна",
    email: "anna@example.ru",
    roleIds: ["ORMCLOUD_AUDITOR", "ORMCLOUD_RISKMANAGER"],
    status: "active",
    lastLogin: "20.12.2025",
  },
  {
    id: "non-paid",
    fullName: "Смирнов Олег Викторович",
    email: "oleg@example.ru",
    roleIds: ["ORMCLOUD_AUDITOR"],
    status: "active",
    lastLogin: "01.03.2026",
  },
  {
    id: "inactive-paid",
    fullName: "Тимофеева Елена Андреевна",
    email: "elena@example.ru",
    roleIds: ["ORMCLOUD_RISKMANAGER"],
    status: "deactivated",
    lastLogin: "01.03.2026",
  },
  {
    id: "coordinator",
    fullName: "Волков Александр Игоревич",
    email: "coordinator@example.ru",
    roleIds: ["ORMCLOUD_COORDINATOR"],
    status: "active",
    lastLogin: "01.03.2026",
  },
];

const filters: AppliedUserFilters = {
  status: "all",
  roleId: "all",
  staleOnly: false,
};

describe("tariff selectors", () => {
  it("provides all modules for both tariffs and keeps Premium unlimited", () => {
    const basic = createTariffFixture(false, "basic");
    const premium = createTariffFixture(false, "premium");

    expect(basic.modules.every((module) => module.includedInContract && module.roleAvailable)).toBe(true);
    expect(premium.modules.every((module) => module.includedInContract && module.roleAvailable)).toBe(true);
    expect(basic.maxPaidUsers).toBe(4);
    expect(premium.maxPaidUsers).toBeNull();
  });

  it("treats only risk managers and coordinators as paid users", () => {
    expect(isPaidUser(users[0])).toBe(true);
    expect(isPaidUser(users[1])).toBe(false);
    expect(isPaidUser(users[3])).toBe(true);
    expect(getActivePaidUsersCount(users)).toBe(2);
  });

  it("prioritizes a paid role for display", () => {
    expect(getPrimaryRoleId(users[0])).toBe("ORMCLOUD_RISKMANAGER");
  });

  it("builds initials from the first two name parts", () => {
    expect(getUserInitials("  Кузнецова   Анна Сергеевна ")).toBe("КА");
  });

  it("keeps avatar colors stable while distributing users across the palette", () => {
    expect(getUserAvatarTone("anna")).toBe(getUserAvatarTone("anna"));
    expect(new Set(users.map((user) => getUserAvatarTone(user.id))).size).toBeGreaterThan(1);
  });

  it("marks users stale after sixty days", () => {
    expect(isStaleUser(users[0], "2026-03-05T12:00:00.000Z")).toBe(true);
    expect(isStaleUser(users[1], "2026-03-05T12:00:00.000Z")).toBe(false);
  });

  it("searches by user fields while filtering roles by stable ids", () => {
    const documents = createUserSearchDocuments(users);
    expect(filterUsers(documents, "анна", [], "all", filters, "2026-03-05")).toHaveLength(1);
    expect(filterUsers(documents, "oleg@", [], "not_billable", filters, "2026-03-05")[0].id).toBe("non-paid");
    expect(
      filterUsers(
        documents,
        "риск-менеджер",
        ["ORMCLOUD_RISKMANAGER"],
        "all",
        filters,
        "2026-03-05",
      ),
    ).toHaveLength(2);
    expect(
      filterUsers(
        documents,
        "",
        [],
        "all",
        { ...filters, roleId: "ORMCLOUD_RISKMANAGER", status: "deactivated" },
        "2026-03-05",
      )[0].id,
    ).toBe("inactive-paid");
  });

  it("blocks only a paid-role activation at the limit", () => {
    expect(getActivationOutcome(users[2], 2, 2)).toBe("limit");
    expect(
      getActivationOutcome({ ...users[1], status: "deactivated" }, 2, 2),
    ).toBe("activate");
    expect(getActivationOutcome(users[2], 200, null)).toBe("activate");
  });

  it("updates status without removing the user or mutating the source", () => {
    const updated = updateUserStatus(users, "inactive-paid", "active");
    expect(updated).toHaveLength(users.length);
    expect(updated.find((user) => user.id === "inactive-paid")?.status).toBe("active");
    expect(users.find((user) => user.id === "inactive-paid")?.status).toBe("deactivated");
  });
});
