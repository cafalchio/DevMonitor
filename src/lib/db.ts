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