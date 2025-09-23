import { invoke } from "@tauri-apps/api/core"
import { create } from "zustand"

interface ConnectionStore {
    isOnline: boolean
    checkOnline: () => Promise<void>
}

const useConnectionStore = create<ConnectionStore>((set) => ({
    isOnline: true,
    checkOnline: async () => {
        const result = await invoke<boolean>("check_online")
        set({ isOnline: result })
    }
}))

export default useConnectionStore
