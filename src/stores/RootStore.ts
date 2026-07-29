import { type Instance, types } from "mobx-state-tree";
import { TariffStore } from "@/stores/TariffStore";

export const RootStore = types.model("RootStore", {
  tariffStore: TariffStore,
});

export type RootStoreInstance = Instance<typeof RootStore>;
