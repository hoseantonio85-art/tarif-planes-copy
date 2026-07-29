import { RootStore, type RootStoreInstance } from "@/stores/RootStore";
import { createInitialTariffStoreSnapshot } from "@/stores/TariffStore";

export const createStore = (search = window.location.search): RootStoreInstance =>
  RootStore.create({
    tariffStore: createInitialTariffStoreSnapshot(search),
  });
