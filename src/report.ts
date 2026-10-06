import { Duration, Effect } from "effect";

import { isStatusOk, LinkChecker } from "./check.ts";
import type { Link } from "./links.ts";

export function reportResult(url: string, status: number | "unreachable" | "timeout"): string {
  const ok = typeof status === "string" ? false : isStatusOk(status);
  return `${ok ? "✓" : "✗"} ${status} ${url}`;
}

export const reportLink = Effect.fn("reportLink")(
  function* (link: Link) {
    const linkChecker = yield* LinkChecker;
    const result = yield* linkChecker.check(link);
    return reportResult(link.url, result);
  },
  Effect.catchTags({
    BadStatus: ({ url, status }) => Effect.succeed(reportResult(url, status)),
    Unreachable: ({ url }) => Effect.succeed(reportResult(url, "unreachable")),
    TimedOut: ({ url }) => Effect.succeed(reportResult(url, "timeout")),
  }),
);

export function reportDuration(duration: Duration.Duration) {
  const ms = Math.round(Duration.toMillis(duration));
  return `${ms}ms`;
}
