import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadCartData = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await api.get("/cart");
      const cart = res.data.cart;
      if (!cart || !cart.items) {
        setCartCount(0);
        return;
      }
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [user]);

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

  const navLinks = user
    ? [
        { text: "Home", icon: <HomeIcon />, to: "/" },
        { text: "My Orders", icon: <ShoppingBagIcon />, to: "/orders" },
        ...(user.role === "admin"
          ? [{ text: "Admin Panel", icon: <AdminPanelSettingsIcon />, to: "/admin/product/list" }]
          : []),
      ]
    : [
        { text: "Home", icon: <HomeIcon />, to: "/" },
      ];

  const authLinks = user
    ? [
        { text: "Logout", icon: <LogoutIcon />, action: logout },
      ]
    : [
        { text: "Login", icon: <LoginIcon />, to: "/Login" },
        { text: "Sign Up", icon: <PersonAddIcon />, to: "/SignUp" },
      ];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Mohit Store
        </Typography>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton
              component={Link}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton
              onClick={() => {
                setDrawerOpen(false);
                if (link.action) link.action();
                else navigate(link.to);
              }}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "background.paper" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "primary.main",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Mohit Store
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  color="inherit"
                  component={Link}
                  to={link.to}
                  sx={{ color: "text.primary" }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
              sx={{ color: "text.primary" }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {!isMobile &&
              (user ? (
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/Login"
                    sx={{ color: "text.primary" }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/SignUp"
                    size="small"
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
