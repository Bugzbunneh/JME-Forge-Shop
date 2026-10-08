import { Outlet, useLocation } from "react-router-dom";
import { useIsSuperUser } from "../hooks/useIsSuperUser";
import AdminMobileNav from "./AdminMobileNav";
import BackToTop from "./BackToTop";
import Footer from "./Footer";
import NavBar from "./NavBar";
import ScrollManager from "./ScrollManager";
import SuperUserDrawer from "./SuperUserDrawer";
import Toaster from "./Toaster";

const Layout = () => {
  const { isSuperUser } = useIsSuperUser();
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/products/");

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-xs focus:bg-ember focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:tracking-widest focus:text-canvas focus:uppercase"
      >
        Skip to content
      </a>
      <ScrollManager />
      {isSuperUser && <SuperUserDrawer />}
      <div className={`flex min-h-screen flex-col ${isSuperUser ? "md:pl-56" : ""}`}>
        {isSuperUser && <AdminMobileNav />}
        <NavBar />
        <main id="main" key={pathname} className="flex-1 animate-fade-in">
          <Outlet />
        </main>
        <Footer reserveSpaceForBuyBar={isProductPage} />
      </div>
      <BackToTop />
      <Toaster />
    </div>
  );
};

export default Layout;
