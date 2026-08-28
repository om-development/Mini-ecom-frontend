import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function PagePagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, page - 1);
    let end = Math.min(totalPages - 1, page + 1);

    if (page <= 3) {
      start = 2;
      end = Math.min(maxVisible, totalPages - 1);
    } else if (page >= totalPages - 2) {
      start = Math.max(2, totalPages - maxVisible + 1);
      end = totalPages - 1;
    }

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const btnSx = {
    minWidth: 36,
    height: 36,
    borderRadius: 980,
    textTransform: "none",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "#ededed",
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "transparent",
    transition: "all 150ms ease",
    p: 0,
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderColor: "rgba(255,255,255,0.16)",
    },
  };

  const activeSx = {
    ...btnSx,
    backgroundColor: "#0071e3",
    borderColor: "#0071e3",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#0056b3",
      borderColor: "#0056b3",
    },
  };

  const disabledSx = {
    ...btnSx,
    color: "#48484a",
    borderColor: "rgba(255,255,255,0.04)",
    cursor: "default",
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "rgba(255,255,255,0.04)",
    },
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, justifyContent: "center" }}>
      {/* Prev */}
      <Button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        sx={page <= 1 ? disabledSx : btnSx}
      >
        <Typography sx={{ fontSize: "0.75rem" }}>&lsaquo;</Typography>
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <Typography key={`dots-${i}`} sx={{ color: "#48484a", px: 0.5, fontSize: "0.8125rem" }}>
            &hellip;
          </Typography>
        ) : (
          <Button
            key={p}
            onClick={() => onChange(p)}
            sx={p === page ? activeSx : btnSx}
          >
            {p}
          </Button>
        )
      )}

      {/* Next */}
      <Button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        sx={page >= totalPages ? disabledSx : btnSx}
      >
        <Typography sx={{ fontSize: "0.75rem" }}>&rsaquo;</Typography>
      </Button>
    </Box>
  );
}
