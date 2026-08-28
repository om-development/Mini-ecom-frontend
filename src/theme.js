import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0071e3",
      light: "#40a9ff",
      dark: "#005bb5",
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
      lineHeight: 1.1,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.15,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "-0.015em",
      lineHeight: 1.25,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "0.9375rem",
      fontWeight: 500,
      letterSpacing: "-0.005em",
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      color: "#6e6e73",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      letterSpacing: "0.02em",
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
    "0 1px 3px rgba(0,0,0,0.3)",
    "0 2px 8px rgba(0,0,0,0.3)",
    "0 4px 16px rgba(0,0,0,0.3)",
    "0 6px 24px rgba(0,0,0,0.35)",
    "0 8px 32px rgba(0,0,0,0.4)",
    "0 12px 40px rgba(0,0,0,0.45)",
    "0 16px 48px rgba(0,0,0,0.5)",
    "0 20px 56px rgba(0,0,0,0.55)",
    "0 24px 64px rgba(0,0,0,0.6)",
    "0 28px 72px rgba(0,0,0,0.6)",
    "0 32px 80px rgba(0,0,0,0.65)",
    "0 36px 88px rgba(0,0,0,0.7)",
    "0 40px 96px rgba(0,0,0,0.7)",
    "0 44px 104px rgba(0,0,0,0.7)",
    "0 48px 112px rgba(0,0,0,0.7)",
    "0 52px 120px rgba(0,0,0,0.7)",
    "0 56px 128px rgba(0,0,0,0.7)",
    "0 60px 136px rgba(0,0,0,0.7)",
    "0 64px 144px rgba(0,0,0,0.7)",
    "0 68px 152px rgba(0,0,0,0.7)",
    "0 72px 160px rgba(0,0,0,0.7)",
    "0 76px 168px rgba(0,0,0,0.7)",
    "0 80px 176px rgba(0,0,0,0.7)",
    "0 84px 184px rgba(0,0,0,0.7)",
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
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
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
          transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
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
          fontSize: "0.9375rem",
          letterSpacing: "-0.01em",
          transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        contained: {
          backgroundColor: "#0071e3",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#0077ed",
            boxShadow: "0 4px 16px rgba(0,113,227,0.3)",
          },
          "&:active": {
            backgroundColor: "#006edb",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#48484a",
            boxShadow: "none",
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
          fontSize: "0.8125rem",
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
            transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.08)",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.16)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0071e3",
              borderWidth: "1px",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(0, 113, 227, 0.15)",
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
          fontSize: "0.8125rem",
          height: 34,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "transparent",
          color: "#6e6e73",
          transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
            backgroundColor: "#0077ed",
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
          transition: "all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
          borderColor: "rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: "0.8125rem",
          border: "1px solid rgba(255, 255, 255, 0.06)",
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
            fontSize: "0.8125rem",
            color: "#6e6e73",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              backgroundColor: "#0071e3",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,113,227,0.3)",
              "&:hover": {
                backgroundColor: "#0077ed",
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
          borderColor: "rgba(255, 255, 255, 0.06)",
          fontSize: "0.875rem",
          padding: "16px",
        },
        head: {
          color: "#6e6e73",
          fontWeight: 500,
          fontSize: "0.8125rem",
          textTransform: "none",
          letterSpacing: "0",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111111",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
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
          animation: "pulse 0.3s ease",
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
          color: "rgba(255, 255, 255, 0.15)",
          transition: "color 0.15s ease",
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
