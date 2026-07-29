import { createContext, type PropsWithChildren, useContext } from "react";
import type { RootStoreInstance } from "@/stores/RootStore";

const StoreContext = createContext<RootStoreInstance | null>(null);

interface StoreProviderProps extends PropsWithChildren {
  store: RootStoreInstance;
}

export const StoreProvider = ({ children, store }: StoreProviderProps) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStore = (): RootStoreInstance => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("StoreProvider is missing in the application tree");
  }
  return store;
};
