import { NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect, FileSystem, Path } from "effect"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const filePath = path.normalize("./fixtures/sample.md")
  const fileString = yield* fs.readFileString(filePath)
  yield* Console.log(`Read ${fileString.length} characters`)
})

program.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain)
