import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
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
    <Container maxWidth="sm" sx={{ mt: { xs: 8, md: 12 } }}>
      <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Welcome back
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 5 }}>
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
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, color: "text.secondary" }}>
          Don't have an account?{" "}
          <Link to="/SignUp" style={{ color: "#0071e3", fontWeight: 500 }}>
            Create one
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
