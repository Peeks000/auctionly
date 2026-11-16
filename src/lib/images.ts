/**
 * AUCTIONLY Curatorial Asset Path Utility
 * Safely encodes URL paths containing spaces, ampersands (&), and special characters
 * so that both Next.js Image components and raw browsers load local public images reliably.
 */
export function safeImagePath(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Split on slashes and encode individual segments (spaces -> %20, & -> %26)
  return path
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
}
