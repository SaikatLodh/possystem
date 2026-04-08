import { useState } from "react";
import { Stepper, Step, StepLabel, Box, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import BasicInformation from "./BasicInformation";
import VerifyCode from "./VerifyCode";
import PersonalInformation from "./PersonalInformation";
import { useQlMutation } from "../../graphql/globalRequest";
import { register, sendOtp, verifyOtp } from "../../graphql/query/auth";
import { setEmail } from "../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useNavigate } from "react-router-dom";
import Resendtimer from "./Resendtimer";
import { enqueueSnackbar } from "notistack";

const basicInfoSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|yahoo\.com|outlook\.com|yopmail\.com)$/,
      "Email must be from gmail.com, yahoo.com, or outlook.com domains",
    ),
});

const verifyCodeSchema = basicInfoSchema.extend({
  code1: z.string().min(1, "Required"),
  code2: z.string().min(1, "Required"),
  code3: z.string().min(1, "Required"),
  code4: z.string().min(1, "Required"),
});

const personalInfoSchema = verifyCodeSchema.extend({
  fullname: z.string().min(1, "Full name is required"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Invalid phone number"),
  password: z.string().min(6, "Min 6 characters"),
});

const schemas = [basicInfoSchema, verifyCodeSchema, personalInfoSchema];

type RegisterFormData = z.infer<typeof personalInfoSchema>;

export type { RegisterFormData };

const Register = () => {
  const steps = ["Basic Information", "Verify Code", "Personal Information"];
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm<RegisterFormData>({
    mode: "onBlur",
    resolver: zodResolver(schemas[activeStep] as any),
  });
  const { mutate: sendotp, isPending: otpPending } = useQlMutation(sendOtp);
  const { mutate: verifyotp, isPending: verifyPending } =
    useQlMutation(verifyOtp);
  const { mutate: registerUser, isPending: registerPending } =
    useQlMutation(register);
  const { email } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: RegisterFormData) => {
    const formErrors = methods.formState.errors;
    console.log("Form Errors:", formErrors);
    if (activeStep === 0) {
      // Validate email step

      const emailData = {
        email: data.email,
      };
      sendotp(emailData, {
        onSuccess: (res) => {
          if (res.sendOtp.status === 200 || res.sendOtp.status === 201) {
            enqueueSnackbar(res.sendOtp.message, { variant: "success" });
            setActiveStep((prev) => prev + 1);
            dispatch(setEmail(data.email));
          } else {
            enqueueSnackbar(res.sendOtp.message, { variant: "error" });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response.errors[0].message || "Failed to send OTP",
            {
              variant: "error",
            },
          );
        },
      });
    } else if (activeStep === 1) {
      const verifyData = {
        email: email,
        otp: Number(data?.code1 + data?.code2 + data?.code3 + data?.code4),
      };
      verifyotp(verifyData, {
        onSuccess: (res) => {
          if (res.verifyOtp.status === 200 || res.verifyOtp.status === 201) {
            enqueueSnackbar(res.verifyOtp.message, { variant: "success" });
            setActiveStep((prev) => prev + 1);
          } else {
            enqueueSnackbar(res.verifyOtp.message, { variant: "error" });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response.errors[0].message || "Failed to verify OTP",
            { variant: "error" },
          );
        },
      });
    } else if (activeStep === 2) {
      const registerData = {
        fullname: data.fullname?.toLocaleLowerCase(),
        email: email,
        password: data.password,
        number: data.number.toString(),
      };
      registerUser(registerData, {
        onSuccess: (res) => {
          if (res.register.status === 200 || res.register.status === 201) {
            enqueueSnackbar(res.register.message, { variant: "success" });
            setActiveStep((prev) => prev + 1);
            navigate("/login");
          } else {
            enqueueSnackbar(res.register.message, { variant: "error" });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response.errors[0].message || "Failed to register user",
            { variant: "error" },
          );
        },
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <>
      <FormProvider {...methods}>
        <Box>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-root .Mui-completed": {
                color: "#FDC700",
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: "#FDC700",
              },
              "& .MuiStepIcon-root": {
                color: "white",
              },
              "& .css-1g86afo-MuiStepIcon-text": {
                fill: "black",
              },
              "& .MuiStepLabel-label": {
                color: "#ababab",
              },
              "& .MuiStepLabel-label.Mui-active": {
                fontWeight: "semibold",
                color: "#ababab",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "#4caf50",
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                borderColor: "#FDC700",
              },
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                borderColor: "#4caf50",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box sx={{ mt: 3 }}>
              {activeStep === 0 && <BasicInformation />}
              {activeStep === 1 && <VerifyCode />}
              {activeStep === 2 && <PersonalInformation />}
            </Box>

            <Button
              disabled={otpPending || verifyPending || registerPending}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                width: "100%",
                py: 1.5,
                mt: 3,
                backgroundColor: "#FDC700",
                color: `${otpPending || verifyPending || registerPending ? "white" : "black"}`,
                fontWeight: "bold",
                borderRadius: "10px",
              }}
            >
              Tap To continue
            </Button>
          </form>
        </Box>
        {activeStep === 1 && <Resendtimer />}
        {activeStep > 0 && (
          <Button
            type="button"
            onClick={handleBack}
            sx={{
              color: "black",
              marginTop: "20px",
              bgcolor: "#FDC700",
              fontWeight: "bold",
            }}
          >
            Back
          </Button>
        )}
      </FormProvider>
    </>
  );
};

export default Register;
