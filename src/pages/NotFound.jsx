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
            color: "#48484a",
            lineHeight: 1,
            mb: 2,
            animation: "float 3s ease-in-out infinite",
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ color: "#6e6e73", mb: 4, fontWeight: 400 }}>
          Page not found
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
