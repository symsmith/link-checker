export type Link = { text: string; url: string }

const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g

export function extractLinks(md: string): Link[] {
  const matches = Array.from(md.matchAll(linkPattern), (v) => ({
    text: v[1] ?? "",
    url: v[2] ?? "",
  }))
  return matches
}
