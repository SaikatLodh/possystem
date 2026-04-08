import { Grid, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormData } from "./Register";

const VerifyCode = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {(["code1", "code2", "code3", "code4"] as const).map(
          (name, index) => (
            <Grid item xs={3} key={name}>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    sx={{
                      width: "47px",
                      borderRadius: "6px",
                      border: "1px solid #FDC700",
                      backgroundColor: "#1F1F1F",
                      "& .MuiOutlinedInput-input": {
                        color: "white",
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "#888888",
                        opacity: 1,
                      },
                    }}
                    value={field.value || ""}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    inputProps={{ maxLength: 1 }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e, index);
                    }}
                  />
                )}
              />
              <h5 className="text-[#ff0000] pt-2 text-[14px]">
                {errors[name]?.message}
              </h5>
            </Grid>
          ),
        )}
      </Grid>
    </>
  );
};

export default VerifyCode;
