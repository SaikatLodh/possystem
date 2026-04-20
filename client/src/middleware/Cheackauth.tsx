import { Navigate, useLocation } from "react-router-dom";
import type { User } from "../interface";

const Cheackauth = ({
  isAuthenticated,
  user,
  children,
}: {
  isAuthenticated: boolean;
  user: User | null;
  children: React.ReactNode;
}) => {
  const location = useLocation();

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgotsendmail") ||
      location.pathname.startsWith("/forgotpassword")
    )
  ) {
    return <Navigate to="/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgotsendmail") ||
      location.pathname.startsWith("/forgotpassword"))
  ) {
    return <Navigate to="/" />;
  }

  if (user?.role === "customer" && location.pathname === "/") {
    return <Navigate to="/foods" />;
  }



  return <div>{children}</div>;
};

export default Cheackauth;
