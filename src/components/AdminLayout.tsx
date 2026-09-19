import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
