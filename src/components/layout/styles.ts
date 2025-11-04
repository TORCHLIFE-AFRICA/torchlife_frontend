"use client";

import styled from "@emotion/styled";

export const NavBar = styled("header")({
  width: "80%",
  margin: "20px auto",
  padding: "20px 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#FFFFFF",
  position: "relative",

  "& h1": {
    fontWeight: 800,
    color: "#00796B",
    fontSize: "24px",
  },

  "& .buttons": {
    display: "flex",
    alignItems: "center",
  },

  "@media (max-width: 768px)": {
    padding: "20px",
    "& .buttons": {
      display: "none", // hide desktop buttons
    },
  },
});

export const NavLinks = styled("nav")({
  display: "flex",
  gap: "20px",
  "& a": {
    textDecoration: "none",
    color: "#334155",
    fontSize: "16px",
    "&:hover": {
      color: "#00796B",
    },
  },
  "@media (max-width: 768px)": {
    display: "none", // hide links on small screens
  },
});

// Hamburger icon
export const MenuIcon = styled("div")({
  display: "none",
  fontSize: "24px",
  cursor: "pointer",
  "@media (max-width: 768px)": {
    display: "block",
  },
});

// Mobile dropdown
export const MobileMenu = styled("div")({
  position: "absolute",
  top: "70px",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  gap: "15px",
  "& a": {
    textDecoration: "none",
    color: "#334155",
    fontSize: "16px",
    "&:hover": {
      color: "#00796B",
    },
  },

  // ✅ Hide menu on large screens
  "@media (min-width: 769px)": {
    display: "none",
  },
});