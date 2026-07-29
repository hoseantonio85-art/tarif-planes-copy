import { lazy, Suspense, type ReactNode } from "react";
import { Loader, Row } from "@sber-orm/ui-kit";
import type { RouteObject } from "react-router-dom";
import type { TariffRoute } from "@/providers/router/config";
import classes from "@/providers/utils.module.scss";

export const PageLoader = () => (
  <Row align="middle" justify="center" className={classes.loader}>
    <Loader />
  </Row>
);

export const mapRoutesForUse = (routes: TariffRoute[]): RouteObject[] =>
  routes.map(({ children, component, index = false, path }) =>
    ({
      children: children && mapRoutesForUse(children),
      element: component,
      index,
      path,
    }) as RouteObject,
  );

export const LazyLoadRoute = (componentName: "TariffInfo"): ReactNode => {
  const LazyElement = lazy(() =>
    import(`@/pages/${componentName}/index.ts`).then((components) => ({
      default: components[componentName],
    })),
  );

  return (
    <Suspense fallback={<PageLoader />}>
      <LazyElement />
    </Suspense>
  );
};
