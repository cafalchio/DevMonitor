import ItemPC from "@/components/serverItem"
import { fetchPCs } from "@/lib/db"
import useConnectionStore from "@/stores/connection"
import { ServerPC } from "@/types/server"
import { useEffect, useState } from "react"

function Home() {
    const { isOnline, checkOnline } = useConnectionStore()
    const [serversList, setServersList] = useState<ServerPC[]>([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState<string | null>(null)
    const [reloaded, setReloaded] = useState(false)

    useEffect(() => {
        checkOnline()
    }, [checkOnline])

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const pcs = await fetchPCs()
                if (!cancelled) setServersList(pcs)
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
    }, [reloaded])

    return (
        <div className="pt-safe-top pb-safe-bottom flex flex-col gap-4 overflow-y-auto px-4">
            {/* Online/Offline Status */}
            <div className="text-md flex items-center justify-start gap-2 font-bold">
                <span>{isOnline ? "" : "System Offline!"}</span>
            </div>

            {/* Loading/Error */}
            {loading && <div className="text-gray-500">Loading servers…</div>}
            {err && (
                <div className="font-medium text-red-600">
                    Failed to load: {err}
                </div>
            )}

            {/* Servers List */}
            <div className="flex flex-col">
                {serversList.map((server) => (
                    <ItemPC
                        key={`${server.serverName}-${server.ip_domain}`}
                        server={server}
                        reloaded={reloaded}
                        setReloaded={setReloaded}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
