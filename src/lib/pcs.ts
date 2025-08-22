import { getDB } from "@/lib/db"
import type { ServerPC } from "@/types/server"

export async function fetchPCs(): Promise<ServerPC[]> {
  const db = await getDB()
  // Map DB column names to your TS type. Adjust names as needed.
  const rows = await db.select<{
    id: number
    serverName: string
    ip_domain: string
    protocol: string
    port: number
    time_ms: number
    notify: boolean
  }[]>(
    `SELECT id, serverName, ip_domain, protocol, port, timeMilliseconds, notify
     FROM pcs
     ORDER BY server_name`
  )

  return rows.map(r => ({
    id: r.id,
    serverName: r.serverName,
    ip_domain: r.ip_domain,
    protocol: r.protocol,
    port: r.port,
    timeMilliseconds: r.time_ms,
    notify: r.notify
  })) as ServerPC[]
}
