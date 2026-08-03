import { describe, expect, it } from "vitest";
import { createTariffStore } from "@/stores/TariffStore";

describe("TariffStore", () => {
  it("does not activate a paid user above the tariff limit", () => {
    const store = createTariffStore("?scenario=limit");

    store.requestUserStatusChange("elena");

    expect(store.contract.users.find((user) => user.id === "elena")?.status).toBe(
      "deactivated",
    );
    expect(store.limitWarning).toBe(true);

    store.clearLimitWarning();
    store.requestUserStatusChange("elena");

    expect(store.contract.users.find((user) => user.id === "elena")?.status).toBe(
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
    expect(store.activePaidUsers).toBe(1);

    store.requestUserStatusChange("elena");

    expect(store.contract.users.find((user) => user.id === "elena")?.status).toBe(
      "active",
    );
    expect(store.activePaidUsers).toBe(2);
    expect(store.feedback).toBe("activated");
  });

  it("activates a non-billable user without consuming a tariff slot", () => {
    const store = createTariffStore("?scenario=limit");
    const activePaidUsers = store.activePaidUsers;

    store.requestUserStatusChange("maria");

    expect(store.contract.users.find((user) => user.id === "maria")?.status).toBe(
      "active",
    );
    expect(store.activePaidUsers).toBe(activePaidUsers);
    expect(store.limitWarning).toBe(false);
  });

  it("does not limit paid users on Premium", () => {
    const store = createTariffStore("?tariff=premium&scenario=limit");

    store.requestUserStatusChange("elena");

    expect(store.contract.maxPaidUsers).toBeNull();
    expect(store.contract.users.find((user) => user.id === "elena")?.status).toBe("active");
    expect(store.limitWarning).toBe(false);
  });

  it("does not change users in view-only mode", () => {
    const store = createTariffStore("?permission=view");

    store.requestUserStatusChange("anna");

    expect(store.dialog).toBeNull();
    expect(store.contract.users.find((user) => user.id === "anna")?.status).toBe(
      "active",
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

  it("searches by localized role through stable role ids", () => {
    const store = createTariffStore();

    store.setQuery("аудитор", ["ORMCLOUD_AUDITOR"]);

    expect(store.filteredUsers.map((user) => user.id)).toEqual(["oleg", "natalia"]);
  });

  it("creates reproducible loading, refreshing, empty and access states", () => {
    expect(createTariffStore("?scenario=loading").isLoading).toBe(true);
    expect(createTariffStore("?scenario=refreshing").isRefreshing).toBe(true);
    expect(createTariffStore("?scenario=empty").filteredUsers).toHaveLength(0);
    expect(
      createTariffStore("?access=pending_provisioning").accessState,
    ).toBe("pending_provisioning");
    expect(createTariffStore("?access=deactivated").accessState).toBe(
      "deactivated",
    );

    const failedStore = createTariffStore("?access=provisioning_failed");
    failedStore.retryProvisioning();
    expect(failedStore.accessState).toBe("active");
  });
});
