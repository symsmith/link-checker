import { Duration, Effect } from "effect";

import { isStatusOk, LinkChecker } from "./check.ts";
import type { Link } from "./links.ts";

export function reportResult(url: string, status: number | "unreachable" | "timeout"): string {
  const ok = typeof status === "string" ? false : isStatusOk(status);
  return `${ok ? "✓" : "✗"} ${status} ${url}`;
}

type LinkReport = {
  ok: boolean;
  line: string;
};

function okReport(line: string): LinkReport {
  return { line, ok: true };
}

function brokenReport(line: string): LinkReport {
  return { line, ok: false };
}

export const reportLink: (link: Link) => Effect.Effect<LinkReport, never, LinkChecker> = Effect.fn(
  "reportLink",
)(
  function* (link: Link) {
    const linkChecker = yield* LinkChecker;
    const result = yield* linkChecker.check(link);
    return okReport(reportResult(link.url, result));
  },
  Effect.catchTags({
    BadStatus: ({ url, status }) => Effect.succeed(brokenReport(reportResult(url, status))),
    Unreachable: ({ url }) => Effect.succeed(brokenReport(reportResult(url, "unreachable"))),
    TimedOut: ({ url }) => Effect.succeed(brokenReport(reportResult(url, "timeout"))),
  }),
);

export function countBroken(reports: ReadonlyArray<LinkReport>): number {
  return reports.reduce((acc, report) => acc + (report.ok ? 0 : 1), 0);
}

export function reportDuration(duration: Duration.Duration) {
  const ms = Math.round(Duration.toMillis(duration));
  return `${ms}ms`;
}
