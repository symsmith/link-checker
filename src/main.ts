import { NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect, FileSystem, Path } from "effect"

import { extractLinks } from "./links.ts"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const filePath = path.normalize("./fixtures/sample.md")
  const fileString = yield* fs.readFileString(filePath)
  const links = extractLinks(fileString)

  yield* Console.log(`Found ${links.length} links`)
  yield* Effect.forEach(links, (link) => Console.log(`- ${link.text} -> ${link.url}`), {
    discard: true,
  })
})

program.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain)
