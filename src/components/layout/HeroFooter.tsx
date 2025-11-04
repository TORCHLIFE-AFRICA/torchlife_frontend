import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export const HeroFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1A2E28",
        color: "white",
        px: { xs: 3, md: 8 },
        py: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "flex-start" },
        gap: { xs: 4, md: 0 },
      }}
    >
      {/* TorchLife Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          TorchLife
        </Typography>
        <Typography variant="body2">©2025 TorchLife. All rights reserved.</Typography>
      </Box>

      {/* Navigation Links */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Navigation Links
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2">Home</Typography>
          <Typography variant="body2">Browse Campaigns</Typography>
          <Typography variant="body2">How It Works</Typography>
          <Typography variant="body2">Start a Campaign</Typography>
          <Typography variant="body2">Donate Now</Typography>
        </Stack>
      </Box>

      {/* Contact Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Contact
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2">support@torchlife.org</Typography>
          <Typography variant="body2">+234 706 901 4391</Typography>
          <Typography variant="body2">Contact Us</Typography>
        </Stack>
      </Box>

      {/* Social Media */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Social Media
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2">X (Formerly Twitter)</Typography>
          <Typography variant="body2">Instagram</Typography>
          <Typography variant="body2">LinkedIn</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default HeroFooter;
