import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cheackauth from "./middleware/Cheackauth";
import { useAppSelector } from "./store/hook";
import MainWrapper from "./pages/MainWrapper";
import Profile from "./pages/Profile";


const Auth = lazy(() => import("./pages/Auth"));
const LogIn = lazy(() => import("./components/auth/LogIn"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgotSendMail = lazy(() => import("./components/auth/ForgotSendMail"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const Home = lazy(() => import("./pages/Home"));
const Foods = lazy(() => import("./pages/Foods"))
const Orders = lazy(() => import("./pages/Orders "));
const Tables = lazy(() => import("./pages/Tables "));
const Menu = lazy(() => import("./pages/Menu"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ServiceUnavailable = lazy(() => import("./pages/ServiceUnavailable"));
const NotFound = lazy(() => import("./pages/NotFound"));


import Loading from "./components/shared/Loading";

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/login"
              element={
                <Cheackauth isAuthenticated={isAuthenticated} user={user}>
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
            <Route path="/" element={<Cheackauth isAuthenticated={isAuthenticated} user={user}>
              <MainWrapper />
            </Cheackauth>}>
              <Route
                index
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Home />
                  </Cheackauth>
                }
              />
              <Route
                path="/foods"
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Foods />
                  </Cheackauth>
                }
              />
              <Route
                path="/tables"
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Tables />
                  </Cheackauth>
                }
              />
              <Route
                path="/orders"
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Orders />
                  </Cheackauth>
                }
              />

              <Route
                path="/menu"
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Menu />
                  </Cheackauth>
                }
              />
              <Route path="/profile" element={
                <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                  <Profile />
                </Cheackauth>
              } />
              <Route
                path="/dashboard"
                element={
                  <Cheackauth isAuthenticated={isAuthenticated} user={user}>
                    <Dashboard />
                  </Cheackauth>
                }
              />
            </Route>

            <Route path="/503" element={<ServiceUnavailable />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
