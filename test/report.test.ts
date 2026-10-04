import { describe, expect, it } from "@effect/vitest";
import { Duration } from "effect";

import { reportDuration, reportResult } from "../src/report.ts";

describe("reportResult", () => {
  it("reports an 200 status", () => {
    expect(reportResult("https://example.com", 200)).toBe("✓ 200 https://example.com");
  });

  it("reports an 201 status", () => {
    expect(reportResult("https://example.com", 201)).toBe("✓ 201 https://example.com");
  });

  it("reports a 301 status", () => {
    expect(reportResult("https://example.com/moved", 301)).toBe("✓ 301 https://example.com/moved");
  });

  it("reports a 404 status", () => {
    expect(reportResult("https://example.com/missing-page", 404)).toBe(
      "✗ 404 https://example.com/missing-page",
    );
  });

  it("reports an unreachable link", () => {
    expect(reportResult("https://wrong.domain", "unreachable")).toBe(
      "✗ unreachable https://wrong.domain",
    );
  });
});

describe("reportDuration", () => {
  it("rounds the duration in ms", () => {
    const ms = 742.34;
    const duration = Duration.millis(ms);
    expect(reportDuration(duration)).toBe("742ms");
  });
});
