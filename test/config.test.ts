import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Duration, Effect } from "effect";

import { Settings } from "../src/config.ts";

describe("Settings", () => {
  it.effect("reads the values passed", () =>
    Effect.gen(function* () {
      const provider = ConfigProvider.fromEnv({ env: { CONCURRENCY: "3", TIMEOUT: "200 millis" } });
      const settings = yield* Settings.parse(provider);
      expect(settings).toEqual({ concurrency: 3, timeout: Duration.millis(200) });
    }),
  );

  it.effect("uses the default values", () =>
    Effect.gen(function* () {
      const provider = ConfigProvider.fromEnv({ env: {} });
      const settings = yield* Settings.parse(provider);
      expect(settings).toEqual({ concurrency: 5, timeout: Duration.seconds(2) });
    }),
  );

  it.effect("checks for bad values", () =>
    Effect.gen(function* () {
      const provider = ConfigProvider.fromEnv({ env: { CONCURRENCY: "0" } });
      const error = yield* Settings.parse(provider).pipe(Effect.flip);
      expect(error._tag).toBe("ConfigError");
    }),
  );
});
