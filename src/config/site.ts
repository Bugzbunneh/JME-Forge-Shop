export const siteConfig = {
  name: "JME Forge Shop",
  ownerName: "Josh Ellison",
  location: "Chorley, Lancashire",
  instagramUrl: "https://www.instagram.com/jme_forge",
  instagramHandle: "@jme_forge",
};

export interface NavItem {
  label: string;
  to: string;
}

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Custom orders", to: "/#custom" },
];
