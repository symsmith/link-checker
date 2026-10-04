import { Console, Effect } from "effect"
import { HttpClient } from "effect/http"

import type { Link } from "./links.ts"
import { formatResult } from "./report.ts"

export const checkLink = Effect.fn("checkLink")(function* (link: Link) {
  const response = yield* HttpClient.get(link.url)
  yield* Console.log(formatResult(link.url, response.status))
})
