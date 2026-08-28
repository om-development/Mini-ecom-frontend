import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("error");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login", form);
      setSeverity("success");
      setMsg("Welcome back!");
      login(response.data.user);
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      setSeverity("error");
      setMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* Apple blue accent line */}
        <Box
          sx={{
            width: 40,
            height: 3,
            borderRadius: 980,
            backgroundColor: "#0071e3",
            mx: "auto",
            mb: 3,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            mb: 1,
            textAlign: "center",
          }}
        >
          Welcome back
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 5, textAlign: "center" }}>
          Sign in to your account
        </Typography>

        {msg && (
          <Alert severity={severity} sx={{ mb: 3 }}>{msg}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            sx={{ mb: 2.5 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Your password"
            sx={{ mb: 4 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              py: 1.5,
              boxShadow: "0 4px 16px rgba(0,113,227,0.25)",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,113,227,0.35)",
              },
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          Don't have an account?{" "}
          <Link
            to="/SignUp"
            style={{
              color: "#0071e3",
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.7"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Create one
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
