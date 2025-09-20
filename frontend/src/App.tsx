import ChatBox from "@components/ChatBox";
import Sidebar from "@components/Sidebar";
import Community from "@pages/Community";
import Credits from "@pages/Credits";
import { assets } from "assets/assets";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./assets/prism.css";
import Loading from "@pages/Loading";
import Login from "@pages/Login";
import useAppContext from "context/AppContext";

function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { user } = useAppContext();

  if (pathname === "/loading") return <Loading />;
  return (
    <>
      {!menuOpen && (
        <img
          src={assets.menu_icon}
          alt="menu"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Routes>
              set
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
}

export default App;
