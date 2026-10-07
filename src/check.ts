import { Context, Duration, Effect, Layer, Schedule } from "effect";
import { HttpClient } from "effect/http";

import { BadStatus, TimedOut, Unreachable } from "./errors.ts";
import type { Link } from "./links.ts";

export function isStatusOk(status: number): boolean {
  if (status >= 200 && status < 400) {
    return true;
  }
  return false;
}

export class LinkChecker extends Context.Service<
  LinkChecker,
  { check: (link: Link) => Effect.Effect<number, BadStatus | Unreachable | TimedOut> }
>()("link-checker/LinkChecker") {
  static readonly layer = (timeout: Duration.Duration) =>
    Layer.effect(
      LinkChecker,
      Effect.gen(function* () {
        const client = yield* HttpClient.HttpClient;

        const check = Effect.fn("LinkChecker.check")(function* (link: Link) {
          const response = yield* client.get(link.url).pipe(
            Effect.mapError((cause) => new Unreachable({ url: link.url, cause })),
            Effect.timeoutOrElse({
              duration: timeout,
              orElse: () => new TimedOut({ url: link.url }),
            }),
            Effect.retry({ times: 2, schedule: Schedule.exponential("200 millis") }),
          );

          const isOk = isStatusOk(response.status);
          if (isOk) {
            return response.status;
          }
          return yield* new BadStatus({ url: link.url, status: response.status });
        });

        return LinkChecker.of({ check });
      }),
    );
}
