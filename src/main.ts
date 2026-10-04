import { NodeHttpClient, NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect, FileSystem, Path } from "effect"

import { checkLink } from "./check.ts"
import { extractLinks } from "./links.ts"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const filePath = path.normalize("./fixtures/sample.md")
  const fileString = yield* fs.readFileString(filePath)
  const links = extractLinks(fileString)

  yield* Console.log(`Checking ${links.length} links…`)
  yield* Effect.forEach(links, checkLink, { discard: true })
})

program.pipe(Effect.provide([NodeServices.layer, NodeHttpClient.layerUndici]), NodeRuntime.runMain)
