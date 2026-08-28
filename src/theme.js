import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0071e3",
      light: "#40a9ff",
      dark: "#0056b3",
    },
    secondary: {
      main: "#ff3b30",
      light: "#ff6961",
      dark: "#d32f2f",
    },
    background: {
      default: "#000000",
      paper: "#0a0a0a",
    },
    success: {
      main: "#10b981",
      light: "#4ade80",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    info: {
      main: "#5ac8fa",
    },
    text: {
      primary: "#ededed",
      secondary: "#6e6e73",
      disabled: "#48484a",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "-0.015em",
      lineHeight: 1.25,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 400,
      letterSpacing: "-0.01em",
      lineHeight: 1.6,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "-0.005em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#6e6e73",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.3)",
    "0 1px 2px rgba(0,0,0,0.3)",
    "0 4px 12px rgba(0,0,0,0.5)",
    "0 4px 12px rgba(0,0,0,0.5)",
    "0 4px 12px rgba(0,0,0,0.5)",
    "0 4px 12px rgba(0,0,0,0.5)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
    "0 8px 24px rgba(0,0,0,0.6)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        "*:focus-visible": {
          outline: "2px solid #0071e3",
          outlineOffset: "2px",
        },
        "::-webkit-scrollbar": {
          width: "6px",
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#333",
          borderRadius: "3px",
        },
        "::selection": {
          background: "rgba(0, 113, 227, 0.3)",
        },
        "@keyframes scaleIn": {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "@keyframes fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "*": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 16,
          transition: "all 150ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            borderColor: "rgba(255, 255, 255, 0.16)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 980,
          padding: "10px 24px",
          fontSize: "1rem",
          letterSpacing: "-0.01em",
          transition: "all 150ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        contained: {
          backgroundColor: "#0071e3",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#0056b3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
          "&:active": {
            backgroundColor: "#004a99",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#48484a",
            boxShadow: "none",
            transform: "none",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "#ededed",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.35)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
          "&.Mui-disabled": {
            borderColor: "rgba(255, 255, 255, 0.05)",
            color: "#48484a",
          },
        },
        text: {
          color: "#ededed",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          },
          "&.Mui-disabled": {
            color: "#48484a",
          },
        },
        sizeSmall: {
          padding: "6px 16px",
          fontSize: "0.875rem",
        },
        sizeLarge: {
          padding: "14px 32px",
          fontSize: "1rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            transition: "border-color 150ms ease, background-color 150ms ease",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0071e3",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#6e6e73",
            "&.Mui-focused": {
              color: "#0071e3",
            },
          },
          "& .MuiFormHelperText-root": {
            color: "#6e6e73",
            fontSize: "0.75rem",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 980,
          fontWeight: 500,
          fontSize: "0.875rem",
          height: 34,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "transparent",
          color: "#6e6e73",
          transition: "all 150ms ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            color: "#ededed",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          "&.MuiChip-clickable:active": {
            transform: "scale(0.96)",
          },
        },
        colorPrimary: {
          backgroundColor: "#0071e3",
          color: "#ffffff",
          border: "none",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        },
        colorDefault: {
          backgroundColor: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#6e6e73",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            color: "#ededed",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 150ms ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          },
          "&:active": {
            transform: "scale(0.92)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: "0.875rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
        standardSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.2)",
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        },
        standardInfo: {
          backgroundColor: "rgba(90, 200, 250, 0.1)",
          color: "#5ac8fa",
          border: "1px solid rgba(90, 200, 250, 0.2)",
        },
        filled: {
          fontWeight: 500,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            borderRadius: 980,
            minWidth: 36,
            height: 36,
            fontSize: "0.875rem",
            color: "#6e6e73",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 150ms ease",
            "&.Mui-selected": {
              backgroundColor: "#0071e3",
              color: "#ffffff",
              border: "none",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.08)",
          fontSize: "0.875rem",
          padding: "16px",
        },
        head: {
          color: "#6e6e73",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111111",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0a0a0a",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#0071e3",
        },
        badge: {
          fontSize: "0.625rem",
          fontWeight: 600,
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          borderRadius: 10,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.2)",
          transition: "color 150ms ease",
          "&.Mui-checked": {
            color: "#0071e3",
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
  },
});

export default theme;
