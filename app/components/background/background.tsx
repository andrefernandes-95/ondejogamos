import { Stack } from "@mui/material";
import { green } from "@mui/material/colors";

export const Background = () => {
  return (
    <>
      <Stack
        sx={(theme) => ({
          backgroundImage: `linear-gradient(
            180deg,
            ${theme.palette.primary.main} 0%,
            ${theme.palette.common.white} 100%
          )`,
          width: "100%",
          height: "25%",
          position: "fixed",
          left: 0,
          top: 0,
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: -1,
        })}
      />

      {/* <Stack
        sx={(theme) => ({
          backgroundImage: `linear-gradient(
            0deg,
            ${green[500]} 0%,
            rgba(255, 255, 255, 0) 100%
          )`,
          width: "100%",
          height: "25%",
          position: "fixed",
          left: 0,
          bottom: 0,
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: -1,
        })}
      /> */}
    </>
  );
};
