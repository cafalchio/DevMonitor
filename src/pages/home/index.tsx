import ItemPC from "@/components/pc_item"
import useConnectionStore from "@/stores/connection"
import { Server } from "@/types/server"
import Database from "@tauri-apps/plugin-sql"
import { useEffect, useState } from "react"

const db = await Database.load("sqlite:mydatabase.db")
const servers = await db.select<Server[]>("SELECT * FROM pcs")

function Home() {
    const { isOnline, checkOnline } = useConnectionStore()
    const [serversList, setServersList] = useState(servers)

    useEffect(() => {
        checkOnline()
    }, [checkOnline])

    useEffect(() => {
        if (servers) {
            setServersList(servers)
        }
    }, [servers])

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
            {serversList &&
                serversList.map((server) => {
                    return <ItemPC key={server.serverName} server={server} />
                })}
        </div>
    )
}

export default Home
