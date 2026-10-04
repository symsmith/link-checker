function result(url: string, status: number, ok: boolean): string {
  return `${ok ? "✓" : "✗"} ${status} ${url}`
}

export function formatResult(url: string, status: number): string {
  if (status >= 200 && status < 400) {
    return result(url, status, true)
  }
  return result(url, status, false)
}
