import { Outlet } from "react-router-dom";
import { useIsSuperUser } from "../hooks/useIsSuperUser";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SuperUserDrawer from "./SuperUserDrawer";

const Layout = () => {
  const { isSuperUser } = useIsSuperUser();

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {isSuperUser && <SuperUserDrawer />}
      <div className={`flex min-h-screen flex-col ${isSuperUser ? "pl-56" : ""}`}>
        <NavBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
