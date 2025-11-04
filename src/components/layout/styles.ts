"use client";

import styled from "@emotion/styled";

export const NavBar = styled("header")({
  maxWidth: "1200px",
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

interface NavButtonProps {
  variant?: "filled" | "outlined";
}

export const NavButton = styled("a")<NavButtonProps>(({ variant }) => ({
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


// export const HeroSection = styled('main')({
//   maxWidth: '1200px',
//   margin: '40px auto',
//   padding: '0 40px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   flexWrap: 'wrap',
// })

// export const HeroText = styled('section')({
//   maxWidth: '500px',
//   '& h1': {
//     fontSize: '40px',
//     fontWeight: 800,
//     lineHeight: 1.2,
//   },
//   '& p': {
//     marginTop: '16px',
//     color: '#475569',
//   },
// })

// export const HeroButtons = styled('div')({
//   marginTop: '24px',
//   display: 'flex',
//   gap: '16px',
// })

// export const ImageWrapper = styled('div')({
//   borderRadius: '16px',
//   overflow: 'hidden',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//   '& img': {
//     width: '400px',
//     height: 'auto',
//     objectFit: 'cover',
//   },
// })

// export const Section = styled('section')({
//   backgroundColor: '#fff',
//   padding: '60px 20px',
//   textAlign: 'center',
// })

// export const SectionTitle = styled('h2')({
//   fontSize: '24px',
//   fontWeight: 700,
//   color: '#0f172a',
// })

// export const SectionText = styled('p')({
//   color: '#475569',
//   marginTop: '10px',
//   maxWidth: '600px',
//   margin: '10px auto 0',
// })

// export const Grid = styled('div')({
//   marginTop: '40px',
//   display: 'grid',
//   gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//   gap: '24px',
// })

// export const Card = styled('div')({
//   backgroundColor: '#ecfdf5',
//   padding: '24px',
//   borderRadius: '12px',
//   boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
// })

// export const CardIcon = styled('div')({
//   height: '56px',
//   width: '56px',
//   backgroundColor: '#fff',
//   borderRadius: '50%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '24px',
//   margin: '0 auto',
// })

// export const CardTitle = styled('h3')({
//   marginTop: '12px',
//   fontWeight: 600,
// })

// export const CardDescription = styled('p')({
//   marginTop: '8px',
//   fontSize: '14px',
//   color: '#475569',
// })

// export const CTASection = styled('section')({
//   textAlign: 'center',
//   padding: '60px 20px',
//   '& h2': { fontWeight: 700 },
//   '& p': { marginTop: '10px', color: '#475569' },
// })