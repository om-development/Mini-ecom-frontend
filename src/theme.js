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
      main: "#34c759",
      light: "#4ade80",
    },
    warning: {
      main: "#ff9f0a",
    },
    error: {
      main: "#ff3b30",
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
      letterSpacing: "-0.025em",
      lineHeight: 1.1,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.15,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: "-0.015em",
      lineHeight: 1.25,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "1rem",
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
    button: {
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
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
          border: "0.5px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 16,
          transition: "opacity 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            opacity: 0.85,
            borderColor: "rgba(255, 255, 255, 0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0a0a0a",
          border: "0.5px solid rgba(255, 255, 255, 0.08)",
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
          transition: "all 0.2s ease",
        },
        contained: {
          backgroundColor: "#0071e3",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#0077ed",
            boxShadow: "none",
          },
          "&:active": {
            backgroundColor: "#006edb",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#48484a",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.15)",
          color: "#ededed",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
          },
          "&.Mui-disabled": {
            borderColor: "rgba(255, 255, 255, 0.05)",
            color: "#48484a",
          },
        },
        text: {
          color: "#ededed",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
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
            transition: "border-color 0.2s ease, background-color 0.2s ease",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.08)",
              borderWidth: "0.5px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0071e3",
              borderWidth: "1px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#6e6e73",
            "&.Mui-focused": {
              color: "#0071e3",
            },
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
          height: 32,
          border: "0.5px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "transparent",
          color: "#6e6e73",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#ededed",
          },
          "&.MuiChip-clickable:active": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
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
          border: "0.5px solid rgba(255, 255, 255, 0.1)",
          color: "#6e6e73",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#ededed",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
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
          border: "0.5px solid rgba(255, 255, 255, 0.06)",
        },
        standardSuccess: {
          backgroundColor: "rgba(52, 199, 89, 0.1)",
          color: "#34c759",
          border: "0.5px solid rgba(52, 199, 89, 0.2)",
        },
        standardError: {
          backgroundColor: "rgba(255, 59, 48, 0.1)",
          color: "#ff3b30",
          border: "0.5px solid rgba(255, 59, 48, 0.2)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 159, 10, 0.1)",
          color: "#ff9f0a",
          border: "0.5px solid rgba(255, 159, 10, 0.2)",
        },
        standardInfo: {
          backgroundColor: "rgba(90, 200, 250, 0.1)",
          color: "#5ac8fa",
          border: "0.5px solid rgba(90, 200, 250, 0.2)",
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
            border: "0.5px solid rgba(255, 255, 255, 0.08)",
            "&.Mui-selected": {
              backgroundColor: "#0071e3",
              color: "#ffffff",
              border: "none",
              "&:hover": {
                backgroundColor: "#0077ed",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
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
          border: "0.5px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111111",
          borderLeft: "0.5px solid rgba(255, 255, 255, 0.08)",
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
  },
});

export default theme;
