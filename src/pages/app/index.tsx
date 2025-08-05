import { Route, Routes } from "react-router-dom";
import Navbar2 from "@/components/Navbar2";
import Home from "../home";
// import Database from '@tauri-apps/plugin-sql';


// const db = await Database.load('sqlite:mydatabase.db');


function App() {
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