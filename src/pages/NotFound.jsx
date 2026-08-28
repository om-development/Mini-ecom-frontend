import { Link } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <Typography variant="h1" color="primary" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Page not found
        </Typography>
        <Button variant="contained" component={Link} to="/" size="large">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
