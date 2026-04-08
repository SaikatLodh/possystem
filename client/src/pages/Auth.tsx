import { useEffect } from "react";
import Resturent from "../assets/restaurant-img.jpg";
import Logo from "../assets/logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Login";
  }, []);

  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        {/* BG Image */}
        <img
          className="w-full h-full object-cover"
          src={Resturent}
          alt="Restaurant Image"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Serve customers the best food with prompt and friendly service in a
          welcoming atmosphere, and they’ll keep coming back."
          <br />
          <span className="block mt-4 text-yellow-400">
            - Founder of Restro
          </span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className="flex flex-col items-center gap-2">
          <img
            src={Logo}
            alt="Restro Logo"
            className="h-14 w-14 border-2 rounded-full p-1"
          />
          <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">
            Restro
          </h1>
        </div>

        <h2 className="text-4xl text-center mt-10 font-semibold text-yellow-400 mb-10">
          {location.pathname === "/login/register"
            ? "Employee Registration"
            : location.pathname === "/login"
              ? "Employee Login"
              : location.pathname === "/login/forgotsendmail"
                ? "Forgot Send Mail"
                : "Forgot Password"}
        </h2>

        {/* Components */}

        <Outlet />
        <div className="flex w-full items-center mt-6 gap-2">
          <div className="w-[40%]">
            {" "}
            <p className="text-sm text-[#ababab]">
              {location.pathname === "/login/register" ? (
                ""
              ) : location.pathname === "/login" ? (
                <Link to="/login/forgotsendmail">Forgot your password?</Link>
              ) : (
                ""
              )}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-[#ababab]">
              {location.pathname === "/login/register"
                ? "Already have an account?"
                : location.pathname === "/login"
                  ? "Don't have an account?"
                  : location.pathname === "/login/forgotsendmail"
                    ? "Already have an account?"
                    : ""}
            </p>
            <Link
              className="text-yellow-400 font-semibold hover:underline"
              to={
                location.pathname === "/login/register"
                  ? "/login"
                  : location.pathname === "/login"
                    ? "/login/register"
                    : location.pathname === "/login/forgotsendmail"
                      ? "/login"
                      : "/login/register"
              }
            >
              {location.pathname === "/login/register"
                ? "Sign in"
                : location.pathname === "/login"
                  ? "Sign up"
                  : location.pathname === "/login/forgotsendmail"
                    ? "Sign in"
                    : ""}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
