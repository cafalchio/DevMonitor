import { getDB } from "@/lib/db"
import type { ServerPC } from "@/types/server"

export async function fetchPCs(): Promise<ServerPC[]> {
  const db = await getDB()
  // Map DB column names to your TS type. Adjust names as needed.
  const rows = await db.select<ServerPC[]>(
    `SELECT serverName, ip_domain, protocol, port, timeMilliseconds, notify
     FROM servers
     ORDER BY serverName`
  )
  return rows
}