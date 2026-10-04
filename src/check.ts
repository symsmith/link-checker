import { Effect } from "effect";
import { HttpClient } from "effect/http";

import { BadStatus, Unreachable } from "./errors.ts";
import type { Link } from "./links.ts";

export function isStatusOk(status: number): boolean {
  if (status >= 200 && status < 400) {
    return true;
  }
  return false;
}

export const checkLink = Effect.fn("checkLink")(function* (link: Link) {
  const response = yield* HttpClient.get(link.url).pipe(
    Effect.mapError((cause) => new Unreachable({ url: link.url, cause })),
  );

  const isOk = isStatusOk(response.status);
  if (isOk) {
    return response.status;
  }
  return yield* new BadStatus({ url: link.url, status: response.status });
});
