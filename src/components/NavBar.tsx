import { useState } from "react";
import { NavLink } from "react-router-dom";
import AccountNavLink from "./AccountNavLink";
import InstagramIcon from "./InstagramIcon";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `block py-2 text-sm uppercase tracking-widest transition-colors hover:text-neutral-300 sm:inline sm:py-0 ${
    isActive ? "text-white" : "text-neutral-500"
  }`;

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-neutral-700">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:grid sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="text-2xl text-white sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className="hidden sm:flex sm:items-center sm:gap-8 sm:justify-self-start">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClasses}>
            Products from the forge
          </NavLink>
        </nav>

        <NavLink to="/" aria-label="J.M.E Forge home" className="sm:justify-self-center">
          <img src="/images/logo.png" alt="J.M.E Forge logo" className="h-12 w-auto sm:h-16" />
        </NavLink>

        <div className="flex items-center gap-4 sm:gap-5 sm:justify-self-end">
          <AccountNavLink />
          <a
            href="https://www.instagram.com/jme_forge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Josh Ellison on Instagram"
          >
            <InstagramIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </a>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-neutral-700 px-6 py-4 sm:hidden">
          <NavLink to="/" end className={navLinkClasses} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClasses} onClick={() => setMenuOpen(false)}>
            Products from the forge
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
