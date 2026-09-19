import { NavLink } from "react-router-dom";

const drawerLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
    isActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
  }`;

const SuperUserDrawer = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-56 border-r border-neutral-700 bg-neutral-900">
      <p className="px-4 py-6 text-xs tracking-widest text-neutral-500 uppercase">Admin</p>
      <nav>
        <NavLink to="/admin/orders" className={drawerLinkClasses}>
          All orders
        </NavLink>
        <NavLink to="/admin/products" className={drawerLinkClasses}>
          Manage products
        </NavLink>
      </nav>
    </aside>
  );
};

export default SuperUserDrawer;
