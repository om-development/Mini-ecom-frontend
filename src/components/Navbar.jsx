import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navbar() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadCartData = async () => {
    if (!user) { setCartCount(0); return; }
    try {
      const res = await api.get("/cart");
      const cart = res.data.cart;
      if (!cart || !cart.items) { setCartCount(0); return; }
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => { loadCartData(); }, [user]);
  useEffect(() => {
    window.addEventListener("cartUpdated", loadCartData);
    return () => window.removeEventListener("cartUpdated", loadCartData);
  }, [user]);

  const logout = async () => {
    await authLogout();
    setCartCount(0);
    setDrawerOpen(false);
    navigate("/Login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { text: "Home", to: "/" },
        { text: "Orders", to: "/orders" },
        ...(user.role === "admin" ? [{ text: "Admin", to: "/admin/product/list" }] : []),
      ]
    : [];

  const NavLinkButton = ({ link }) => {
    const active = isActive(link.to);
    return (
      <Button
        component={Link}
        to={link.to}
        sx={{
          color: active ? "#0071e3" : "#6e6e73",
          fontSize: "0.875rem",
          px: 1.5,
          fontWeight: active ? 500 : 400,
          position: "relative",
          textTransform: "none",
          "&:hover": { color: active ? "#0071e3" : "#ededed", backgroundColor: "transparent" },
          "&::after": active
            ? {
                content: '""',
                position: "absolute",
                bottom: -2,
                left: "50%",
                transform: "translateX(-50%)",
                width: 16,
                height: 2,
                borderRadius: 980,
                backgroundColor: "#0071e3",
              }
            : {},
        }}
      >
        {link.text}
      </Button>
    );
  };

  // Mobile menu
  if (isMobile) {
    return (
      <>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "none",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: 2, height: 52 }}>
            <Box
              component={Link}
              to="/"
              sx={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, letterSpacing: "-0.02em", fontSize: "1.1rem", color: "#ededed" }}>
                OM-G
              </Typography>
              {user && (
                <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem" }}>
                  Welcome, {user.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ color: "#6e6e73", position: "relative" }}
              >
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "#ededed" }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              width: 280,
            },
          }}
        >
          <Box sx={{ p: "24px 16px", height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: 500, letterSpacing: "-0.02em" }}>OM-G</Typography>
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#6e6e73" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            {user && (
              <Typography sx={{ color: "#6e6e73", fontSize: "0.8125rem", mb: 3 }}>
                Welcome, {user.name}
              </Typography>
            )}

            <Stack spacing={0.75} sx={{ flex: 1 }}>
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link key={link.text} to={link.to} style={{ textDecoration: "none" }}>
                    <Box
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        p: "12px 16px",
                        borderRadius: "12px",
                        backgroundColor: active ? "rgba(0,113,227,0.1)" : "transparent",
                        borderLeft: active ? "3px solid #0071e3" : "3px solid transparent",
                        transition: "all 150ms ease",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "rgba(0,113,227,0.05)" },
                      }}
                    >
                      <Typography
                        sx={{
                          color: active ? "#0071e3" : "#ededed",
                          fontWeight: active ? 600 : 400,
                          fontSize: "0.9375rem",
                        }}
                      >
                        {link.text}
                      </Typography>
                    </Box>
                  </Link>
                );
              })}
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

            {user ? (
              <Box
                onClick={logout}
                sx={{
                  p: "12px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
                }}
              >
                <Typography sx={{ color: "#ef4444", fontSize: "0.9375rem" }}>Logout</Typography>
              </Box>
            ) : (
              <Stack spacing={0.75}>
                <Link to="/Login" style={{ textDecoration: "none" }}>
                  <Box
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      p: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                    }}
                  >
                    <Typography sx={{ color: "#ededed", fontSize: "0.9375rem" }}>Login</Typography>
                  </Box>
                </Link>
                <Link to="/SignUp" style={{ textDecoration: "none" }}>
                  <Box
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      p: "12px 16px",
                      borderRadius: 980,
                      backgroundColor: "#0071e3",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                      "&:hover": { backgroundColor: "#0056b3" },
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontSize: "0.9375rem", fontWeight: 500 }}>Sign Up</Typography>
                  </Box>
                </Link>
              </Stack>
            )}
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop navbar
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(50%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 52 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#ededed",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "-0.02em",
            fontSize: "1.1rem",
          }}
        >
          OM-G
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {navLinks.map((link) => (
            <NavLinkButton key={link.text} link={link} />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2 }}>
          {user && (
            <Typography sx={{ color: "#6e6e73", fontSize: "0.8125rem", mr: 1, whiteSpace: "nowrap" }}>
              Welcome, {user.name}
            </Typography>
          )}

          <IconButton
            component={Link}
            to="/cart"
            sx={{ color: "#6e6e73", "&:hover": { color: "#ededed" } }}
          >
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </IconButton>

          {user ? (
            <Button
              variant="text"
              size="small"
              onClick={logout}
              sx={{
                color: "#6e6e73",
                fontSize: "0.875rem",
                textTransform: "none",
                "&:hover": { color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" },
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/Login"
                sx={{
                  color: isActive("/Login") ? "#0071e3" : "#6e6e73",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  "&:hover": { color: "#0071e3" },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/SignUp"
                size="small"
                sx={{ fontSize: "0.875rem", px: 2.5, textTransform: "none" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
