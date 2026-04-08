import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cheackauth from "./middleware/Cheackauth";
import { useAppDispatch, useAppSelector } from "./store/hook";
import useQlQuery, { useQlMutation } from "./graphql/globalRequest";
import { refreshToken } from "./graphql/query/auth";

const Auth = lazy(() => import("./pages/Auth"));
const LogIn = lazy(() => import("./components/auth/LogIn"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgotSendMail = lazy(() => import("./components/auth/ForgotSendMail"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const Home = lazy(() => import("./pages/Home"));
const Orders = lazy(() => import("./pages/Orders "));
const Tables = lazy(() => import("./pages/Tables "));
const Menu = lazy(() => import("./pages/Menu"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
import Cookies from "js-cookie";
import { getUser } from "./graphql/query/user";
import { USER } from "./tanstackKeys";
import { setuser } from "./store/auth/authSlice";

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { mutate } = useQlMutation(refreshToken);
  const { data } = useQlQuery(USER, getUser);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setInterval(
        () => {
          mutate(
            {
              token:
                Cookies.get("refreshToken") ||
                localStorage.getItem("refreshToken") ||
                "",
            },
            {
              onSuccess: (res) => {
                if (
                  res.refreshToken.status === 200 ||
                  res.refreshToken.status === 201
                ) {
                  localStorage.setItem(
                    "accessToken",
                    res.refreshToken.accessToken,
                  );
                  Cookies.set("accessToken", res.refreshToken.accessToken, {
                    expires: 15 / (60 * 24),
                  });
                  dispatch(setuser(data?.getUser.user));
                }
              },
              onError: (err) => {
                console.error("Failed to refresh token:", err);
              },
            },
          );
        },
        14 * 60 * 1000,
      );

      if (timer) {
        clearInterval(timer);
      }
    }
  }, [isAuthenticated, mutate, dispatch, data]);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/login"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Auth />
                </Cheackauth>
              }
            >
              <Route index element={<LogIn />} />
              <Route path="register" element={<Register />} />
              <Route path="forgotsendmail" element={<ForgotSendMail />} />
              <Route
                path="forgotpassword/:token"
                element={<ForgotPassword />}
              />
            </Route>
            <Route
              path="/"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Home />
                </Cheackauth>
              }
            />

            <Route
              path="/orders"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Orders />
                </Cheackauth>
              }
            />
            <Route
              path="/tables"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Tables />
                </Cheackauth>
              }
            />
            <Route
              path="/menu"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Menu />
                </Cheackauth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Cheackauth isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </Cheackauth>
              }
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
