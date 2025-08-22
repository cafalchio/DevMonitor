import SettingsDrawer from "@/components/SideBar"
import useConnectionStore from "@/stores/connection"
import usePermissionStore from "@/stores/permissions"
import {
    isPermissionGranted,
    requestPermission
} from "@tauri-apps/plugin-notification"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../home"

// Ask for permission once

function App() {
    const { setMessagePermission } = usePermissionStore()
    const { checkOnline } = useConnectionStore()

    // ASK for Notification permission when connected first time:
    useEffect(() => {
        ;(async () => {
            let granted = await isPermissionGranted()
            if (!granted) {
                granted = (await requestPermission()) === "granted"
            }
            setMessagePermission(granted)
        })()
    }, [setMessagePermission])

    // check if user is online every x seconds
    useEffect(() => {
        checkOnline()
        const interval = setInterval(checkOnline, 30_000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="pt-safe-top pb-safe-bottom mt-8 mb-8">
                test
                <SettingsDrawer />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </>
    )
}

export default App
