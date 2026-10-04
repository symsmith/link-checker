import { describe, expect, it } from "@effect/vitest"

import { formatResult } from "../src/report.ts"

describe("formatResult", () => {
  it("reports an 200 status", () => {
    expect(formatResult("https://example.com", 200)).toBe("✓ 200 https://example.com")
  })

  it("reports an 201 status", () => {
    expect(formatResult("https://example.com", 201)).toBe("✓ 201 https://example.com")
  })

  it("reports a 404 status", () => {
    expect(formatResult("https://example.com/missing-page", 404)).toBe(
      "✗ 404 https://example.com/missing-page",
    )
  })

  it("reports a 301 status", () => {
    expect(formatResult("https://example.com/moved", 301)).toBe("✓ 301 https://example.com/moved")
  })
})
