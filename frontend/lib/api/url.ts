const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function apiURL(path: string): string {
  return API_BASE + path;
}
