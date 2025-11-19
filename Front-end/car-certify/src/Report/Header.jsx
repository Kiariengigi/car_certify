import React from "react";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../Styles/report_styles_header.css'

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      if (window.scrollY > 20) {
        setScrolled(true); // add shrink effect
      } else {
        setScrolled(false);
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  return (
    <header className={`floating-header fixed top-0 left-0 w-full shadow transition-transform duration-300 ${hidden ? "hide" : ""} ${scrolled ? "shrink" : ""}`} style={{ top: "2rem" }}>
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <h1 className="h3 mb-0">Detailed Report</h1>

        <Nav id="mainNav" variant="tabs" className="nav-tabs">
          <Nav.Item>
            <Nav.Link href="#general-summary">General Summary</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#mileage">Mileage</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#ownership">Ownership</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#market-value">Market Value</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </header>
  );
};

export default Header;
