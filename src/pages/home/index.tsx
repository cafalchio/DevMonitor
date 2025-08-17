import ItemPC from "@/components/pc_item"
import useConnectionStore from "@/stores/connection"
import { ServerCall } from "@/types/server"
import { useEffect } from "react"

function Home() {
    const { isOnline, checkOnline } = useConnectionStore()

    const call: ServerCall = {
        domain: "www.gmail.com",
        ip: "",
        protocol: "https",
        port: 443
    }

    useEffect(() => {
        checkOnline() // run once on mount
    }, [checkOnline])

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
            <ItemPC serverName="Gmail: " timePingMs={60_000} Call={call} />
        </div>
    )
}

export default Home
