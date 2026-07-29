import type { ReactNode } from "react";
import type { RouteProps } from "react-router";
import { LazyLoadRoute } from "@/providers/utils";

export type TariffRoute = Omit<RouteProps, "children" | "element"> & {
  component?: ReactNode;
  children?: TariffRoute[];
};

export const routes: TariffRoute[] = [
  {
    path: "/tariff",
    component: LazyLoadRoute("TariffInfo"),
  },
];
