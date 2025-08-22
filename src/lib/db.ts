import DB from "@tauri-apps/plugin-sql"

let dbPromise: Promise<DB> | null = null

export function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = DB.load("sqlite:mydatabase.db")
  }
  return dbPromise
}