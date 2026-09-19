import { Navigate, Outlet } from "react-router-dom";
import { useIsSuperUser } from "../hooks/useIsSuperUser";

const RequireSuperUser = () => {
  const { isSuperUser, isLoading } = useIsSuperUser();

  if (isLoading) {
    return <p className="mx-auto max-w-5xl px-6 py-16 text-center text-neutral-500">Loading…</p>;
  }

  if (!isSuperUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireSuperUser;
