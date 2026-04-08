import { InputAdornment, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import type { RegisterFormData } from "./Register";

const BasicInformation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormData>();
  return (
    <>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <>
            <label className="block mb-2 text-sm font-medium text-[#ababab]">
              Email
            </label>
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
              fullWidth
              placeholder="Enter your email"
              type="email"
              value={field.value || ""}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#FDC700" }} />{" "}
                  </InputAdornment>
                ),
              }}
              error={!!errors.email}
              helperText={errors.email?.message || ""}
            />
          </>
        )}
      />
    </>
  );
};

export default BasicInformation;
