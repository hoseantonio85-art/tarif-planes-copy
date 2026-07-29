import { defaultNamespace, resources } from "@/i18n/config";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: typeof defaultNamespace;
    resources: (typeof resources)["ru"];
  }
}
