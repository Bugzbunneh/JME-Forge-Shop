import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import UserIcon from "./UserIcon";

const AccountNavLink = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return (
      <Link
        to="/account"
        aria-label="Your account"
        className="text-fg transition-colors hover:text-ember"
      >
        <UserIcon className="h-6 w-6" />
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="text-[0.7rem] font-medium tracking-[0.2em] text-muted uppercase transition-colors hover:text-fg"
    >
      Login
    </Link>
  );
};

export default AccountNavLink;
