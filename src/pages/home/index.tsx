import ItemPC from "@/components/pc_item"
import { getDB } from "@/lib/db" // 👈 import your helper
import useConnectionStore from "@/stores/connection"
import { ServerPC } from "@/types/server"
import { useEffect, useState } from "react"

function Home() {
    const { isOnline, checkOnline } = useConnectionStore()
    const [serversList, setServersList] = useState<ServerPC[]>([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState<string | null>(null)

    useEffect(() => {
        checkOnline()
    }, [checkOnline])

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                const db = await getDB()
                type Row = {
                    serverName: string
                    ip_domain: string
                    protocol: string
                    port: number
                    timeMilliseconds: number
                    notify: number // stored as 0/1
                }
                const rows = await db.select<Row[]>(
                    `SELECT serverName, ip_domain, protocol, port, timeMilliseconds, notify 
           FROM pcs 
           ORDER BY serverName`
                )

                if (!cancelled) {
                    const data: ServerPC[] = rows.map((r) => ({
                        serverName: r.serverName,
                        ip_domain: r.ip_domain,
                        protocol: r.protocol as ServerPC["protocol"],
                        port: r.port,
                        timeMilliseconds: r.timeMilliseconds,
                        notify: Boolean(r.notify)
                    }))
                    setServersList(data)
                }
            } catch (e) {
                if (!cancelled)
                    setErr(e instanceof Error ? e.message : String(e))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className="pt-safe-top pb-safe-bottom flex flex-col items-center justify-center overflow-y-auto">
            <h1 className="text-2xl font-semibold">Home Page</h1>
            <div>
                {isOnline ? <span>Online: </span> : <span>Offline: </span>}
                <span
                    aria-label={isOnline ? "online" : "offline"}
                    className={`inline-block h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
                />
            </div>

            {loading && <div>Loading servers…</div>}
            {err && <div className="text-red-600">Failed to load: {err}</div>}

            {serversList.map((server) => (
                <ItemPC
                    key={`${server.serverName}-${server.ip_domain}`}
                    server={server}
                />
            ))}
        </div>
    )
}

export default Home
