import { Stack } from "@mui/material";

export const Background = () => {
  return (
    <>
      <Stack
        sx={(theme) => ({
          background: theme.palette.grey[200],
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: -1,
        })}
      />
    </>
  );
};
