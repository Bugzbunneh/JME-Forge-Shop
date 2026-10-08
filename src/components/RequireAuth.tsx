import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const RequireAuth = () => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return (
      <p className="container-page py-24 text-center text-sm tracking-[0.2em] text-subtle uppercase">
        Loading…
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
