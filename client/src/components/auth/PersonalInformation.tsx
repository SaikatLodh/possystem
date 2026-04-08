import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import type { RegisterFormData } from "./Register";
import { useAppSelector } from "../../store/hook";

const PersonalInformation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const { email } = useAppSelector((state) => state.auth);
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{
                  backgroundColor: "#1F1F1F",
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#888888",
                    opacity: 1,
                  },
                }}
                {...field}
                label="Full Name"
                fullWidth
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
                value={field.value || ""}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{
                  backgroundColor: "#1F1F1F",
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#888888",
                    opacity: 1,
                  },
                }}
                {...field}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                value={email || ""}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{
                  backgroundColor: "#1F1F1F",
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#888888",
                    opacity: 1,
                  },
                }}
                {...field}
                label="Phone Number"
                fullWidth
                error={!!errors.number}
                helperText={errors.number?.message}
                value={field.value || ""}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{
                  backgroundColor: "#1F1F1F",
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#888888",
                    opacity: 1,
                  },
                }}
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                value={field.value || ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
      </Box>
    </>
  );
};

export default PersonalInformation;
