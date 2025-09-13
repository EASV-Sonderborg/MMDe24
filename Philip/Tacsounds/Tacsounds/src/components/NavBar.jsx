import React from "react";
import "./navBar.css";

const NavBar = () => {
  return (
    <nav className="navBar">
      <a href="/" className="logoLink">
        <img
          src="/src/assets/covers/tacStandard.png"
          alt="Tac Logo"
          className="logo"
        />
      </a>
      <ul className="navLinks">
        <li><a href="/" className="active">Forside</a></li>
        <li><a href="/bibliotek">Bibliotek</a></li>
        <li><a href="/om-mig">Om Mig</a></li>
        <li><a href="/kontakt">Kontakt</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
