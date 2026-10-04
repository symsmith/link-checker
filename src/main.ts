import { NodeHttpClient, NodeRuntime, NodeServices } from "@effect/platform-node"
import { Console, Effect, FileSystem, Path } from "effect"

import { checkLink } from "./check.ts"
import { extractLinks, type Link } from "./links.ts"
import { reportResult } from "./report.ts"

const reportLink = Effect.fn("reportLink")(
  function* (link: Link) {
    const result = yield* checkLink(link)
    yield* Console.log(reportResult(link.url, result))
  },
  Effect.catchTags({
    BadStatus: ({ url, status }) => Console.log(reportResult(url, status)),
    Unreachable: ({ url }) => Console.log(reportResult(url, "unreachable")),
  }),
)

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const filePath = path.normalize("./fixtures/sample.md")
  const fileString = yield* fs.readFileString(filePath)
  const links = extractLinks(fileString)

  yield* Console.log(`Checking ${links.length} links…`)
  yield* Effect.forEach(links, reportLink, { discard: true })
})

program.pipe(Effect.provide([NodeServices.layer, NodeHttpClient.layerUndici]), NodeRuntime.runMain)
