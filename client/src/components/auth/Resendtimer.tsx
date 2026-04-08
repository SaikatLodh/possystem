import React from "react";
import { enqueueSnackbar } from "notistack";
import { useQlMutation } from "../../graphql/globalRequest";
import { sendOtp } from "../../graphql/query/auth";
import { setEmail } from "../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Button } from "@mui/material";

const Resendtimer = () => {
  const [timer, setTimer] = React.useState(120);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { email } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { mutate: sendotp, isPending: otpPending } = useQlMutation(sendOtp);

  React.useEffect(() => {
    if (isDisabled && timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setIsDisabled(false);
    }
  }, [timer, isDisabled]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleResend = () => {
    if (!email || email.trim() === "") {
      return enqueueSnackbar(
        "Email is missing. Please go back and enter your email.",
        { variant: "error" },
      );
    }
    sendotp(
      { email },
      {
        onSuccess: (res) => {
          if (res.sendOtp.status === 200 || res.sendOtp.status === 201) {
            enqueueSnackbar(res.sendOtp.message, { variant: "success" });
            dispatch(setEmail(email));
            setTimer(120);
            setIsDisabled(true);
          }
        },

        onError: (error: any) => {
          enqueueSnackbar(
            error.response.errors[0].message || "Failed to resend OTP",
            { variant: "error" },
          );
        },
      },
    );
  };
  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <h4 className="py-2 text-[#ABABAB]">Didn’t received yet ?</h4>
        {isDisabled ? (
          <Button
            sx={{
              background: "#FDC700",
              color: "black",
              fontWeight: "bold",
              cursor: "not-allowed",
            }}
          >{`Resend it in ${formatTime(timer)}`}</Button>
        ) : (
          <Button
            disabled={isDisabled || otpPending}
            onClick={handleResend}
            sx={{
              background: "#FDC700",
              color: "black",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {otpPending ? "Resending..." : " Resend Email"}
          </Button>
        )}
      </div>
    </>
  );
};

export default Resendtimer;
