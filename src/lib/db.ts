import { ServerPC } from "@/types/server"
import DB from "@tauri-apps/plugin-sql"
import { SetStateAction } from "react"

let dbPromise: Promise<DB> | null = null

export function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = DB.load("sqlite:data.db")
  }
  return dbPromise
}


export async function deleteServer(serverName: string, 
  setDeleted: { (value: SetStateAction<boolean>): void; (arg0: boolean): void }, deleted: boolean) {
    const db = await getDB()
    await db.execute(`DELETE FROM servers WHERE serverName = ?`, [serverName])
    setDeleted(!deleted)
}


export async function getServerList() {
  const db = await getDB()

  const rows = await db.select<ServerPC[]>(
      `SELECT serverName, ip_domain, protocol, port, timeMilliseconds, notify FROM servers ORDER BY serverName`
  )
  return rows
}