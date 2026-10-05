import { Config, Duration, Schema } from "effect";

export const Settings = Config.all({
  concurrency: Config.schema(
    Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
    "CONCURRENCY",
  ).pipe(Config.withDefault(5)),
  timeout: Config.Duration("TIMEOUT").pipe(Config.withDefault(Duration.seconds(2))),
});
