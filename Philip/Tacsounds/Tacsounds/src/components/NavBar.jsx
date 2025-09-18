// NavBar.jsx
import React from "react";
import "./navBar.css";

export default function NavBar({ currentView, onNavigate }) {
  const is = (v) => currentView === v;

  return (
    <nav className="navBar">
      <button
        type="button"
        className="logoLink"
        onClick={() => onNavigate("carousel")}
        aria-label="Forside"
      >
        <img
          src="/assets/covers/tacStandard.png"
          alt="Tac Logo"
          className="logo"
        />
      </button>

      <ul className="navLinks">
        <li>
          <button
            type="button"
            className={`navBtn ${is("carousel") ? "isActive" : ""}`}
            onClick={() => onNavigate("carousel")}
          >
            Forside
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`navBtn ${is("library") ? "isActive" : ""}`}
            onClick={() => onNavigate("library")}
          >
            Bibliotek
          </button>
        </li>
        <li><button type="button" className="navBtn" disabled>Om Mig</button></li>
        <li><button type="button" className="navBtn" disabled>Kontakt</button></li>
      </ul>
    </nav>
  );
}
