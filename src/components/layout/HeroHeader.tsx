"use client";

import React, { useState } from "react";
import { NavBar, NavLinks, MenuIcon, MobileMenu } from "./styles";
import { Button } from "../buttons/styles";

const HeroHeaderLink = [
  { label: 'Home', href: '/' },
  { label: 'Browse Campaigns', href: '/' },
  { label: 'How it Works', href: '/' },
  { label: 'Contact', href: '/' },
];

export const HeroHeader = () => {
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
        {HeroHeaderLink.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </NavLinks>

      <div className="buttons">
        <Button variant="outlined">Sign Up</Button>
        <Button variant="filled">Start a Campaign</Button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <MobileMenu>
          <a href="#">Home</a>
          <a href="#campaigns">Browse Campaigns</a>
          <a href="#how">How it Works</a>
          <a href="#contact">Contact</a>
          <Button variant="outlined">Sign Up</Button>
          <Button variant="filled">Start a Campaign</Button>
        </MobileMenu>
      )}
    </NavBar>
  );
};

export default HeroHeader;
