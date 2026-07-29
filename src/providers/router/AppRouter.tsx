import { memo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { routes } from "@/providers/router/config";
import { mapRoutesForUse } from "@/providers/utils";

export const AppRouter = memo(() =>
  useRoutes([
    ...mapRoutesForUse(routes),
    { path: "*", element: <Navigate to="/tariff" replace /> },
  ]),
);

AppRouter.displayName = "AppRouter";
