import { describe, expect, it } from "@effect/vitest"

import { isStatusOk } from "../src/check.ts"

describe("isStatusOk", () => {
  it("returns not ok for 1xx", () => {
    expect(isStatusOk(199)).toBe(false)
  })

  it("returns ok for 2xx", () => {
    expect(isStatusOk(200)).toBe(true)
    expect(isStatusOk(201)).toBe(true)
    expect(isStatusOk(202)).toBe(true)
    expect(isStatusOk(203)).toBe(true)
    expect(isStatusOk(204)).toBe(true)
    expect(isStatusOk(205)).toBe(true)
    expect(isStatusOk(299)).toBe(true)
  })

  it("returns ok for 3xx", () => {
    expect(isStatusOk(300)).toBe(true)
    expect(isStatusOk(301)).toBe(true)
    expect(isStatusOk(302)).toBe(true)
    expect(isStatusOk(303)).toBe(true)
    expect(isStatusOk(304)).toBe(true)
    expect(isStatusOk(305)).toBe(true)
    expect(isStatusOk(399)).toBe(true)
  })

  it("returns not ok for 4xx", () => {
    expect(isStatusOk(400)).toBe(false)
    expect(isStatusOk(401)).toBe(false)
    expect(isStatusOk(402)).toBe(false)
    expect(isStatusOk(403)).toBe(false)
    expect(isStatusOk(404)).toBe(false)
    expect(isStatusOk(405)).toBe(false)
    expect(isStatusOk(499)).toBe(false)
  })

  it("returns not ok for 5xx", () => {
    expect(isStatusOk(500)).toBe(false)
    expect(isStatusOk(501)).toBe(false)
    expect(isStatusOk(502)).toBe(false)
    expect(isStatusOk(503)).toBe(false)
    expect(isStatusOk(504)).toBe(false)
    expect(isStatusOk(505)).toBe(false)
    expect(isStatusOk(599)).toBe(false)
  })
})
