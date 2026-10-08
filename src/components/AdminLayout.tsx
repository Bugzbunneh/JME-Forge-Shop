import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
