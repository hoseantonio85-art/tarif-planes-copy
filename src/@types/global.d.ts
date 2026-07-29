export {};

declare global {
  interface Window {
    readonly STAND_TYPE: string;
    readonly SBERNORM_CLICKSTREAM_KEY: string;
    readonly SBERNORM_CLICKSTREAM_URL: string;
  }
}
