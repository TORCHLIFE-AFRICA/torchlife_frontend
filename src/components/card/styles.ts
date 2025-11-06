"use client";


import styled from "@emotion/styled";
import { Box, Card } from "@mui/material";

export const CardWrapper = styled(Card)({
  borderRadius: "8px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  width: "450px",
  height: "314px",
  padding: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

export const ImageBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: "12px",
}));
