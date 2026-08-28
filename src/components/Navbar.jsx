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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
        { text: "Home", icon: <HomeIcon />, to: "/" },
        { text: "Orders", icon: <ShoppingBagIcon />, to: "/orders" },
        ...(user.role === "admin"
          ? [{ text: "Admin", icon: <AdminPanelSettingsIcon />, to: "/admin/product/list" }]
          : []),
      ]
    : [{ text: "Home", icon: <HomeIcon />, to: "/" }];

  const authLinks = user
    ? [{ text: "Logout", icon: <LogoutIcon />, action: logout }]
    : [
        { text: "Login", icon: <LoginIcon />, to: "/Login" },
        { text: "Sign Up", icon: <PersonAddIcon />, to: "/SignUp" },
      ];

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box sx={{ p: "20px 24px" }}>
        <Typography variant="h6" sx={{ fontWeight: 500, letterSpacing: "-0.02em" }}>
          OM-G
        </Typography>
        {user && (
          <Typography sx={{ color: "#6e6e73", fontSize: "0.8125rem", mt: 0.5 }}>
            Welcome, {user.name}
          </Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ px: 1 }}>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(link.to)}
              sx={{
                borderRadius: 10,
                py: 1.2,
                "&.Mui-selected": {
                  backgroundColor: "rgba(0,113,227,0.1)",
                  "&:hover": { backgroundColor: "rgba(0,113,227,0.15)" },
                },
                "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isActive(link.to) ? "#0071e3" : "#6e6e73" }}>{link.icon}</ListItemIcon>
              <ListItemText
                primary={link.text}
                primaryTypographyProps={{
                  fontSize: "0.9375rem",
                  fontWeight: isActive(link.to) ? 500 : 400,
                  color: isActive(link.to) ? "#0071e3" : "#ededed",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ px: 1 }}>
        {authLinks.map((link) => (
          <ListItem key={link.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                setDrawerOpen(false);
                if (link.action) link.action();
                else navigate(link.to);
              }}
              sx={{
                borderRadius: 10,
                py: 1.2,
                "&:hover": {
                  backgroundColor: link.text === "Logout" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: link.text === "Logout" ? "#ef4444" : "#6e6e73" }}>{link.icon}</ListItemIcon>
              <ListItemText
                primary={link.text}
                primaryTypographyProps={{
                  fontSize: "0.9375rem",
                  fontWeight: 400,
                  color: link.text === "Logout" ? "#ef4444" : "#ededed",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 52 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1, color: "#ededed" }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

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

          {user && !isMobile && (
            <Typography sx={{ color: "#6e6e73", fontSize: "0.8125rem", mr: 1, whiteSpace: "nowrap" }}>
              Welcome, {user.name}
            </Typography>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Button
                    key={link.text}
                    component={Link}
                    to={link.to}
                    sx={{
                      color: active ? "#0071e3" : "#6e6e73",
                      fontSize: "0.875rem",
                      px: 1.5,
                      fontWeight: active ? 500 : 400,
                      position: "relative",
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
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2 }}>
            <IconButton
              component={Link}
              to="/cart"
              sx={{ color: "#6e6e73", "&:hover": { color: "#ededed" } }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </IconButton>

            {!isMobile &&
              (user ? (
                <Button
                  variant="text"
                  size="small"
                  onClick={logout}
                  sx={{
                    color: "#6e6e73",
                    fontSize: "0.875rem",
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
                    sx={{ fontSize: "0.875rem", px: 2.5 }}
                  >
                    Sign Up
                  </Button>
                </>
              ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}
