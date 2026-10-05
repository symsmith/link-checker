import { Effect, Schedule } from "effect";
import { HttpClient } from "effect/http";

import { BadStatus, TimedOut, Unreachable } from "./errors.ts";
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
    Effect.timeoutOrElse({ duration: "2 seconds", orElse: () => new TimedOut({ url: link.url }) }),
    Effect.retry({ times: 2, schedule: Schedule.exponential("200 millis") }),
  );

  const isOk = isStatusOk(response.status);
  if (isOk) {
    return response.status;
  }
  return yield* new BadStatus({ url: link.url, status: response.status });
});
