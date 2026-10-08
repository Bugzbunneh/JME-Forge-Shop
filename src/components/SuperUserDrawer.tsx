import { NavLink } from "react-router-dom";

const drawerLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `block border-l-2 px-5 py-3 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors ${
    isActive
      ? "border-ember bg-raised text-fg"
      : "border-transparent text-muted hover:bg-raised/60 hover:text-fg"
  }`;

const SuperUserDrawer = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 border-r border-line bg-surface md:block">
      <p className="flex items-center gap-2 px-5 py-6 text-[0.7rem] font-semibold tracking-[0.3em] text-ember uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        Admin
      </p>
      <nav aria-label="Admin">
        <NavLink to="/admin/orders" className={drawerLinkClasses}>
          All orders
        </NavLink>
        <NavLink to="/admin/products" className={drawerLinkClasses}>
          Manage products
        </NavLink>
        <NavLink to="/addproduct" className={drawerLinkClasses}>
          Add product
        </NavLink>
      </nav>
    </aside>
  );
};

export default SuperUserDrawer;
