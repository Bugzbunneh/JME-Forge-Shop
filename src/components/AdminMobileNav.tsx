import { NavLink } from "react-router-dom";

const pillClasses = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 rounded-full border px-4 py-1.5 text-[0.65rem] font-medium tracking-[0.18em] uppercase transition-colors ${
    isActive ? "border-ember bg-ember text-canvas" : "border-line text-muted hover:text-fg"
  }`;

const AdminMobileNav = () => {
  return (
    <nav
      aria-label="Admin"
      className="flex items-center gap-2 overflow-x-auto border-b border-line bg-surface px-5 py-2.5 md:hidden"
    >
      <span className="mr-1 shrink-0 text-[0.65rem] font-semibold tracking-[0.3em] text-ember uppercase">
        Admin
      </span>
      <NavLink to="/admin/orders" className={pillClasses}>
        Orders
      </NavLink>
      <NavLink to="/admin/products" className={pillClasses}>
        Products
      </NavLink>
      <NavLink to="/addproduct" className={pillClasses}>
        Add product
      </NavLink>
    </nav>
  );
};

export default AdminMobileNav;
