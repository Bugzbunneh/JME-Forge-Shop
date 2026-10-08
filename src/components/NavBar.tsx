import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems, siteConfig } from "../config/site";
import AccountNavLink from "./AccountNavLink";
import { CloseIcon, MenuIcon } from "./icons";
import InstagramIcon from "./InstagramIcon";
import SavedNavLink from "./SavedNavLink";

const SCROLLED_THRESHOLD_PX = 24;

const desktopLinkClasses = (isActive: boolean) =>
  `relative py-2 text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ember after:transition-transform after:duration-300 hover:text-fg ${
    isActive ? "text-fg after:scale-x-100" : "text-muted after:scale-x-0 hover:after:scale-x-100"
  }`;

const isHashLink = (to: string) => to.includes("#");

const NavBar = () => {
  const { pathname } = useLocation();
  // Remembering where the menu was opened closes it automatically on any navigation.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = menuOpenedAt === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpenedAt(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpenedAt(null);
  const toggleMenu = () => setMenuOpenedAt(menuOpen ? null : pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
      <div className="container-page grid grid-cols-3 items-center py-2.5">
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-ml-2 p-2 text-fg sm:hidden"
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-9 sm:flex">
            {navItems.map((item) =>
              isHashLink(item.to) ? (
                <Link key={item.to} to={item.to} className={desktopLinkClasses(false)}>
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => desktopLinkClasses(isActive)}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        <Link to="/" aria-label={`${siteConfig.name} home`} className="justify-self-center">
          <img
            src="/images/logo.png"
            alt="J.M.E Forge logo"
            width={321}
            height={310}
            className={`w-auto transition-all duration-300 ${scrolled ? "h-11" : "h-12 sm:h-16"}`}
          />
        </Link>

        <div className="flex items-center gap-3 justify-self-end sm:gap-5">
          <SavedNavLink />
          <AccountNavLink />
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.ownerName} on Instagram`}
            className="transition-transform hover:scale-110"
          >
            <InstagramIcon className="h-6 w-6" />
          </a>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out sm:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Mobile" inert={!menuOpen} className="overflow-hidden">
          <ul className="container-page divide-y divide-line/70 border-t border-line/70 pb-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={closeMenu}
                  className="block py-4 font-display text-3xl font-medium text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
