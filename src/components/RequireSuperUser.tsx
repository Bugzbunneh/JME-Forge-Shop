import { Navigate, Outlet } from "react-router-dom";
import { useIsSuperUser } from "../hooks/useIsSuperUser";

const RequireSuperUser = () => {
  const { isSuperUser, isLoading } = useIsSuperUser();

  if (isLoading) {
    return (
      <p className="container-page py-24 text-center text-sm tracking-[0.2em] text-subtle uppercase">
        Loading…
      </p>
    );
  }

  if (!isSuperUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireSuperUser;
