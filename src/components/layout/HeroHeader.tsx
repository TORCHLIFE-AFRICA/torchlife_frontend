"use client";

import React, { useState } from "react";
import { NavBar, NavLinks, NavButton, MenuIcon, MobileMenu } from "./styles";

export const HeroFooter = () => {
  const [open, setOpen] = useState(false);

  return (
    <NavBar>
      <div>
        <h1>TorchLife</h1>
      </div>

      {/* Hamburger Icon (visible on mobile) */}
      <MenuIcon onClick={() => setOpen(!open)}>
        ☰
      </MenuIcon>

      {/* Desktop Links */}
      <NavLinks>
        <a href="#">Home</a>
        <a href="#campaigns">Browse Campaigns</a>
        <a href="#how">How it Works</a>
        <a href="#contact">Contact</a>
      </NavLinks>

      <div className="buttons">
        <NavButton variant="outlined">Sign Up</NavButton>
        <NavButton variant="filled">Start a Campaign</NavButton>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <MobileMenu>
          <a href="#">Home</a>
          <a href="#campaigns">Browse Campaigns</a>
          <a href="#how">How it Works</a>
          <a href="#contact">Contact</a>
          <NavButton variant="outlined">Sign Up</NavButton>
          <NavButton variant="filled">Start a Campaign</NavButton>
        </MobileMenu>
      )}
    </NavBar>
  );
};

export default HeroFooter;
