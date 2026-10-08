import { Link } from "react-router-dom";
import { navItems, siteConfig } from "../config/site";
import { LockIcon, PinIcon } from "./icons";
import InstagramIcon from "./InstagramIcon";

interface FooterProps {
  reserveSpaceForBuyBar?: boolean;
}

const Footer = ({ reserveSpaceForBuyBar = false }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-12 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src="/images/logo.png"
            alt="J.M.E Forge logo"
            width={321}
            height={310}
            loading="lazy"
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Hand-forged knives made one at a time. No mass production — just authentic craftsmanship
            from a workshop in Lancashire.
          </p>
          <p className="mt-5 flex items-center gap-2 text-xs text-subtle">
            <PinIcon className="h-4 w-4" />
            {siteConfig.location}, UK
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="label text-fg">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/saved" className="transition-colors hover:text-fg">
                Saved pieces
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="label text-fg">Follow the forge</p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
          >
            <InstagramIcon className="h-6 w-6" />
            {siteConfig.instagramHandle}
          </a>
          <p className="mt-6 flex items-center gap-2 text-xs text-subtle">
            <LockIcon className="h-4 w-4" />
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <p
          className={`container-page py-6 text-xs text-subtle ${reserveSpaceForBuyBar ? "max-sm:pb-24" : ""}`}
        >
          &copy; {year} {siteConfig.ownerName}, {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
