import { Route, Routes } from "react-router-dom";
import Navbar2 from "@/components/SideBar";
import Home from "../home";
import { useEffect } from "react";
import {
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/plugin-notification';
import usePermissionStore from "@/stores/permissions";
import useConnectionStore from "@/stores/connection";

// import Database from '@tauri-apps/plugin-sql';
// const db = await Database.load('sqlite:mydatabase.db');
  // Ask for permission once


function App() {
    const {setMessagePermission } = usePermissionStore()
    const {checkOnline } = useConnectionStore()

  // ASK for Notification permission when connected first time:
  useEffect(() => {
    (async () => {
      let granted = await isPermissionGranted();
      if (!granted) {
        granted = (await requestPermission()) === 'granted';
      }
      setMessagePermission(granted);
    })();
  }, [setMessagePermission]);

  
  // check if user is online every x seconds
  useEffect(() => {
    checkOnline(); // immediate
    const interval = setInterval(checkOnline, 10_000);
    return () => clearInterval(interval);
  }, []);


  return (
    <>
    <div className="mt-8 mb-8 pt-safe-top pb-safe-bottom">
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </>

  )
}

export default App;