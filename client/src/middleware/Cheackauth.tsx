import { Navigate, useLocation } from "react-router-dom";

const Cheackauth = ({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;

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

  return <div>{children}</div>;
};

export default Cheackauth;
