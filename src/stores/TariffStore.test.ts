import { describe, expect, it } from "vitest";
import { createTariffStore } from "@/stores/TariffStore";

describe("TariffStore", () => {
  it("does not activate a paid user above the tariff limit", () => {
    const store = createTariffStore("?scenario=limit");

    store.requestUserStatusChange("maria");

    expect(store.contract.users.find((user) => user.id === "maria")?.status).toBe(
      "deactivated",
    );
    expect(store.limitWarning).toBe(true);
  });

  it("requires confirmation before deactivation", () => {
    const store = createTariffStore();

    store.requestUserStatusChange("anna");
    expect(store.dialog).toEqual({ kind: "deactivate", userId: "anna" });
    expect(store.contract.users.find((user) => user.id === "anna")?.status).toBe(
      "active",
    );

    store.confirmDeactivation();
    expect(store.contract.users.find((user) => user.id === "anna")?.status).toBe(
      "deactivated",
    );
  });

  it("applies draft filters only after confirmation", () => {
    const store = createTariffStore();

    store.openFilters();
    store.setDraftRole("ORMCLOUD_AUDITOR");
    expect(store.filteredUsers).toHaveLength(8);

    store.applyFilters();
    expect(store.filteredUsers.map((user) => user.id)).toEqual(["oleg", "natalia"]);
  });
});
