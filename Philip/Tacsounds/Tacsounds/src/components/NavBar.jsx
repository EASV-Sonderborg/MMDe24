import React, { useEffect, useState } from "react";
import "./navBar.css";
import moonIcon from "../assets/icons/moon.svg";
import sunIcon from "../assets/icons/sun.svg";

const NAV_ITEMS = [
  { key: "carousel", label: "Forside", disabled: false },
  { key: "library", label: "Bibliotek", disabled: false },
  { key: "about", label: "Om Mig", disabled: true },
  { key: "contact", label: "Kontakt", disabled: true },
];

export default function NavBar({
  active,
  currentView,
  onNavigate,
  onLogoClick,
  theme = "light",
  onToggleTheme,
}) {
  const resolvedActive = active ?? currentView ?? "carousel";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [resolvedActive]);

  const handleNavigate = (view) => {
    if (view === "about" || view === "contact") return;
    onNavigate?.(view);
  };

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    else handleNavigate("carousel");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className={`navBar ${isOpen ? "navBar--open" : ""}`}>
      <div className="navBar__brand">
        <button
          type="button"
          className="logoLink"
          onClick={handleLogoClick}
          aria-label="Forside"
        >
          <img
            src="/assets/covers/tacStandard.png"
            alt="Tac Logo"
            className="logo"
          />
        </button>

        <button
          type="button"
          className="navBar__toggle"
          aria-expanded={isOpen}
          aria-controls="site-navigation"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <ul id="site-navigation" className={`navLinks ${isOpen ? "isOpen" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={`navBtn ${resolvedActive === item.key ? "isActive" : ""}`}
              onClick={() => handleNavigate(item.key)}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          </li>
        ))}
        <li className="navLinks__themeRow">
          <div className="themeTabs" role="group" aria-label="Theme">
            <button
              type="button"
              className={`themeTab ${theme === "light" ? "isActive" : ""}`}
              onClick={() => theme !== "light" && onToggleTheme?.()}
              aria-pressed={theme === "light"}
            >
              <img src={sunIcon} alt="" />
              Light
            </button>
            <button
              type="button"
              className={`themeTab ${theme === "dark" ? "isActive" : ""}`}
              onClick={() => theme !== "dark" && onToggleTheme?.()}
              aria-pressed={theme === "dark"}
            >
              <img src={moonIcon} alt="" />
              Dark
            </button>
          </div>
        </li>
      </ul>

      <div className="navBar__actions">
        <button
          type="button"
          className={`themeToggle ${theme === "dark" ? "isActive" : ""}`}
          onClick={onToggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <img
            className="themeToggle__icon"
            src={theme === "dark" ? sunIcon : moonIcon}
            alt=""
          />
        </button>
      </div>
    </nav>
  );
}
