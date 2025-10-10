import DB from "@tauri-apps/plugin-sql"

let dbPromise: Promise<DB> | null = null

export function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = DB.load("sqlite:data.db")
  }
  return dbPromise
}
export async function deleteServer(serverName: string) {
    const db = await getDB()
    await db.execute(`DELETE FROM servers WHERE serverName = ?`, [serverName])
    window.location.reload()
}