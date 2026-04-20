import { useAppDispatch, useAppSelector } from "./store/hook";
import useQlQuery, { useQlMutation } from "./graphql/globalRequest";
import { refreshToken } from "./graphql/query/auth";
import Cookies from "js-cookie";
import { getUser } from "./graphql/query/user";
import { USER } from "./tanstackKeys";
import { loginUser, logout, setuser } from "./store/auth/authSlice";
import { useEffect } from "react";

const RefreshToken = ({ children }: { children: React.ReactNode }) => {
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
                if (res.refreshToken.status === 500) {
                  dispatch(logout());
                }
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
                  dispatch(loginUser())
                }
              },
              onError: (err) => {
                dispatch(logout());
                console.error("Failed to refresh token:", err);
              },
            },
          );
        },
        14 * 60 * 1000,
      );
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }




  }, [isAuthenticated, mutate, dispatch, data]);

  useEffect(() => {

    mutate(
      {
        token:
          Cookies.get("refreshToken") ||
          localStorage.getItem("refreshToken") ||
          "",
      },
      {
        onSuccess: (res) => {

          if (res.refreshToken.status === 500) {

            dispatch(logout());
          }
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

            dispatch(loginUser())
          }
        },
        onError: (err) => {
          dispatch(logout());
          console.error("Failed to refresh token:", err);
        },
      },
    );
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setuser(data?.getUser.user));
      dispatch(loginUser())
    } else {
      dispatch(logout());
    }
  }, [data]);
  return (
    <div>{children}</div>
  )
}

export default RefreshToken