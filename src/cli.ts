import { NodeHttpClient } from "@effect/platform-node";
import { Config, Console, Duration, Effect, FileSystem, Layer, Schema } from "effect";
import { Argument, Command, Flag } from "effect/cli";

import { LinkChecker } from "./check.ts";
import { extractLinks } from "./links.ts";
import { reportDuration, reportLink } from "./report.ts";

const file = Argument.File("file", { mustExist: true }).pipe(
  Argument.withDescription("The Markdown file to check"),
);

const concurrency = Flag.Int("concurrency").pipe(
  Flag.withAlias("c"),
  Flag.withFallbackConfig(Config.Int("CONCURRENCY")),
  Flag.withDefault(5),
  Flag.filter(
    (c) => c >= 1,
    (c) => `must be at least 1, got ${c}`,
  ),
  Flag.withDescription("How many links to check at the same time"),
);

const timeout = Flag.String("timeout").pipe(
  Flag.withAlias("t"),
  Flag.withSchema(Schema.DurationFromString),
  Flag.withFallbackConfig(Config.Duration("TIMEOUT")),
  Flag.withDefault(Duration.seconds(2)),
  Flag.withDescription("The duration a server is waited on"),
);

export const cli = Command.make("link-checker", { file, concurrency, timeout }, (input) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const fileString = yield* fs.readFileString(input.file);
    const links = extractLinks(fileString);

    yield* Console.log(`Checking ${links.length} links…`);

    const [duration, results] = yield* Effect.forEach(links, reportLink, {
      concurrency: input.concurrency,
    }).pipe(Effect.timed);
    yield* Effect.forEach(results, (result) => Console.log(result), { discard: true });

    yield* Console.log(`Done in ${reportDuration(duration)}`);
  }),
).pipe(
  Command.withDescription("Check that the links in a Markdown file are valid"),
  Command.provide((input) =>
    LinkChecker.layer(input.timeout).pipe(Layer.provide(NodeHttpClient.layerUndici)),
  ),
);
