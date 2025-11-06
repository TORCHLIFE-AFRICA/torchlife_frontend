"use client";

import styled from "@emotion/styled";

interface ButtonProps {
  variant?: "filled" | "outlined";
}

export const Button = styled("a")<ButtonProps>(({ variant }) => ({
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  padding: "10px 16px",
  borderRadius: "6px",
  border: variant === "outlined" ? "2px solid #00796B" : "none",
  backgroundColor: variant === "filled" ? "#00796B" : "transparent",
  color: variant === "filled" ? "#fff" : "#00796B",
  marginLeft: "20px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: variant === "filled" ? "#064e3b" : "#d1fae5",
  },
  "@media (max-width: 768px)": {
    marginLeft: 0,
    width: "100%",
    textAlign: "center",
  },
}));