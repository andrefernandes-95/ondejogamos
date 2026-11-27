export const softEntrance = {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: "oj-enter 240ms ease-out both",
    "@keyframes oj-enter": {
      from: { opacity: 0, transform: "translateY(5px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },
};
