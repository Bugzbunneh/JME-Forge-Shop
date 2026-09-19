import { NavLink } from "react-router-dom";
import AccountNavLink from "./AccountNavLink";
import InstagramIcon from "./InstagramIcon";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `text-sm uppercase tracking-widest transition-colors hover:text-neutral-300 ${
    isActive ? "text-white" : "text-neutral-500"
  }`;

const NavBar = () => {
  return (
    <header className="border-b border-neutral-700">
      <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-6">
        <nav className="flex items-center gap-8 justify-self-start">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClasses}>
            Products from the forge
          </NavLink>
        </nav>

        <NavLink
          to="/"
          className="justify-self-center text-2xl font-light tracking-[0.3em] whitespace-nowrap text-white uppercase"
        >
          Josh Ellison
        </NavLink>

        <div className="flex items-center gap-5 justify-self-end">
          <a
            href="https://www.instagram.com/jme_forge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Josh Ellison on Instagram"
          >
            <InstagramIcon className="h-7 w-7" />
          </a>
          <AccountNavLink />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
