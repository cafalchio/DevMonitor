import { create } from "zustand"

interface PermissionStore {
    messagePermission: boolean
    setMessagePermission: (value: boolean) => void
}

const usePermissionStore = create<PermissionStore>((set) => ({
    messagePermission: false,
    setMessagePermission: (value: boolean) => set({ messagePermission: value })
}))

export default usePermissionStore
