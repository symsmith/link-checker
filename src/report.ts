import { Duration, Effect } from "effect";

import { checkLink, isStatusOk } from "./check.ts";
import type { Link } from "./links.ts";

export function reportResult(url: string, status: number | "unreachable"): string {
  const ok = status === "unreachable" ? false : isStatusOk(status);
  return `${ok ? "✓" : "✗"} ${status} ${url}`;
}

export const reportLink = Effect.fn("reportLink")(
  function* (link: Link) {
    const result = yield* checkLink(link);
    return reportResult(link.url, result);
  },
  Effect.catchTags({
    BadStatus: ({ url, status }) => Effect.succeed(reportResult(url, status)),
    Unreachable: ({ url }) => Effect.succeed(reportResult(url, "unreachable")),
  }),
);

export function reportDuration(duration: Duration.Duration) {
  const ms = Math.round(Duration.toMillis(duration));
  return `${ms}ms`;
}
