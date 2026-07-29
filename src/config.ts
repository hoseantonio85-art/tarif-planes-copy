const environment = window;

export const Config = {
  clickStreamEnabled: environment.STAND_TYPE === "PROM",
  clickStreamKey: environment.SBERNORM_CLICKSTREAM_KEY,
  clickStreamUrl: environment.SBERNORM_CLICKSTREAM_URL,
} as const;
