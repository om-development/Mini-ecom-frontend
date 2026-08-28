import { Link } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="65vh">
        <Typography
          variant="h1"
          sx={{
            fontSize: "6rem",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "text.disabled",
            lineHeight: 1,
            mb: 2,
            animation: "float 3s ease-in-out infinite",
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ color: "text.secondary", mb: 4, fontWeight: 400 }}>
          Page not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{
            boxShadow: "0 4px 16px rgba(0,113,227,0.25)",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,113,227,0.35)",
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
