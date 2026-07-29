import { Suspense, useState } from "react";
import { baseUrl$, tenant$, user$ } from "@n-orm/auth-mf-app";
import { ClickStreamProvider } from "@sber-orm/components";
import { BrowserRouter } from "react-router-dom";
import { Config } from "@/config";
import "@/i18n";
import { createStore, StoreProvider } from "@/stores";
import { AppRouter } from "@/providers/router";
import { PageLoader } from "@/providers/utils";

const Root = () => {
  const [store] = useState(() => createStore());

  return (
    <Suspense fallback={<PageLoader />}>
      <StoreProvider store={store}>
        <ClickStreamProvider
          clickStreamUrl={Config.clickStreamUrl}
          clickStreamKey={Config.clickStreamKey}
          clickStreamEnabled={Config.clickStreamEnabled}
          appBlockName="SBERNORM_TARIFF_web"
          tenantId={String(tenant$.value.tenantId)}
          userInfo={user$.value}
        >
          <BrowserRouter basename={baseUrl$.default}>
            <AppRouter />
          </BrowserRouter>
        </ClickStreamProvider>
      </StoreProvider>
    </Suspense>
  );
};

export default Root;
