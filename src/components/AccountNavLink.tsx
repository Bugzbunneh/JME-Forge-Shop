import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import UserIcon from "./UserIcon";

const AccountNavLink = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return (
      <Link to="/account" aria-label="Your account" className="text-white">
        <UserIcon className="h-6 w-6" />
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-white"
    >
      <span className="sm:hidden">Login</span>
      <span className="hidden sm:inline">Login / Register</span>
    </Link>
  );
};

export default AccountNavLink;
