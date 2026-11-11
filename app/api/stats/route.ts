import { getPostStats } from "@/lib/stats";

// GET /api/stats - all-time read and comment counts keyed by slug.
// Pages load these in the browser (lib/useStats.ts) so they can stay fully static:
// only this small response refreshes on the `stats` cache profile, not every page.
export async function GET() {
  return Response.json(await getPostStats());
}
