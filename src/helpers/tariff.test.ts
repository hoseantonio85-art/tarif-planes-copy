import { describe, expect, it } from "vitest";
import type { AppliedUserFilters, TariffUser } from "@/@types/tariff";
import {
  createUserSearchDocuments,
  filterUsers,
  getActivationOutcome,
  getActivePaidUsersCount,
  getUserAvatarTone,
  getPrimaryRoleId,
  getUserInitials,
  isStaleUser,
  updateUserStatus,
} from "@/helpers/tariff";

const users: TariffUser[] = [
  {
    id: "paid",
    fullName: "Анна Кузнецова",
    email: "anna@example.ru",
    roleIds: ["ORMCLOUD_AUDITOR", "ORMCLOUD_USER"],
    inTariff: true,
    status: "active",
    lastLogin: "20.12.2025",
  },
  {
    id: "outside",
    fullName: "Олег Смирнов",
    email: "oleg@example.ru",
    roleIds: ["ORMCLOUD_RISKMANAGER"],
    inTariff: false,
    status: "active",
    lastLogin: "01.03.2026",
  },
  {
    id: "inactive",
    fullName: "Мария Дмитриева",
    email: "maria@example.ru",
    roleIds: ["ORMCLOUD_ANALYST"],
    inTariff: true,
    status: "deactivated",
    lastLogin: "01.03.2026",
  },
  {
    id: "coordinator",
    fullName: "Coordinator",
    email: "coordinator@example.ru",
    roleIds: ["ORMCLOUD_COORDINATOR"],
    inTariff: true,
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
  it("counts every active user inside the tariff regardless of role", () => {
    expect(getActivePaidUsersCount(users)).toBe(2);
  });

  it("prioritizes a paid role over display order", () => {
    expect(getPrimaryRoleId(users[0])).toBe("ORMCLOUD_USER");
  });

  it("builds initials from the first two name parts", () => {
    expect(getUserInitials("  Анна   Кузнецова Дмитриевна ")).toBe("АК");
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
    expect(filterUsers(documents, "анна", "all", filters, "2026-03-05")).toHaveLength(1);
    expect(filterUsers(documents, "oleg@", "out_of_tariff", filters, "2026-03-05")[0].id).toBe("outside");
    expect(
      filterUsers(
        documents,
        "",
        "all",
        { ...filters, roleId: "ORMCLOUD_ANALYST", status: "deactivated" },
        "2026-03-05",
      )[0].id,
    ).toBe("inactive");
  });

  it("blocks any in-tariff activation at the limit", () => {
    expect(getActivationOutcome({ ...users[2], status: "deactivated" }, 2, 2)).toBe("limit");
    expect(getActivationOutcome({ ...users[1], status: "deactivated" }, 2, 2)).toBe("activate");
  });

  it("updates status without removing the user or mutating the source", () => {
    const updated = updateUserStatus(users, "inactive", "active");
    expect(updated).toHaveLength(users.length);
    expect(updated.find((user) => user.id === "inactive")?.status).toBe("active");
    expect(users.find((user) => user.id === "inactive")?.status).toBe("deactivated");
  });
});
