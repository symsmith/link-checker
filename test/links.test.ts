import { describe, expect, it } from "@effect/vitest"

import { extractLinks } from "../src/links.ts"

describe("extractLinks", () => {
  it("extracts nothing when there is no link", () => {
    expect(extractLinks("A test file for the link checker.")).toEqual([])
  })

  it("extracts a link when there is one", () => {
    expect(extractLinks("- [Effect website](https://effect.website)")).toEqual([
      { text: "Effect website", url: "https://effect.website" },
    ])
  })

  it("extracts 2 links", () => {
    const md = `- [Example](https://example.com)
- [Broken page](https://example.com/nope-404)`
    expect(extractLinks(md)).toEqual([
      { text: "Example", url: "https://example.com" },
      { text: "Broken page", url: "https://example.com/nope-404" },
    ])
  })
})
