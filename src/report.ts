import { isStatusOk } from "./check.ts"

export function reportResult(url: string, status: number | "unreachable"): string {
  const ok = status === "unreachable" ? false : isStatusOk(status)
  return `${ok ? "✓" : "✗"} ${status} ${url}`
}
