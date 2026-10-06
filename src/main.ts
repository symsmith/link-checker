import { NodeHttpClient, NodeRuntime, NodeServices } from "@effect/platform-node";
import { Console, Effect, FileSystem, Layer, Path } from "effect";

import { LinkChecker } from "./check.ts";
import { Settings } from "./config.ts";
import { extractLinks } from "./links.ts";
import { reportDuration, reportLink } from "./report.ts";

const program = Effect.gen(function* () {
  const settings = yield* Settings;

  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const filePath = path.normalize("./fixtures/sample.md");
  const fileString = yield* fs.readFileString(filePath);
  const links = extractLinks(fileString);

  yield* Console.log(`Checking ${links.length} links…`);

  const [duration, results] = yield* Effect.forEach(links, reportLink, {
    concurrency: settings.concurrency,
  }).pipe(Effect.timed);
  yield* Effect.forEach(results, (result) => Console.log(result), { discard: true });

  yield* Console.log(`Done in ${reportDuration(duration)}`);
});

const LiveLinkChecker = LinkChecker.layer.pipe(Layer.provide(NodeHttpClient.layerUndici));
program.pipe(Effect.provide([NodeServices.layer, LiveLinkChecker]), NodeRuntime.runMain);
