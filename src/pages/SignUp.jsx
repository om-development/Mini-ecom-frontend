import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("error");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);
    try {
      await api.post("/auth/signup", form);
      setSeverity("success");
      setMsg("Account created! Redirecting...");
      setTimeout(() => navigate("/Login"), 1200);
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
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            mb: 1,
            textAlign: "center",
          }}
        >
          Create account
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 5, textAlign: "center" }}>
          Get started in seconds
        </Typography>

        {msg && (
          <Alert severity={severity} sx={{ mb: 3 }}>{msg}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            sx={{ mb: 2.5 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
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
            helperText="Must be at least 6 characters"
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
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          Already have an account?{" "}
          <Link to="/Login" style={{ color: "#0071e3", fontWeight: 500 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
