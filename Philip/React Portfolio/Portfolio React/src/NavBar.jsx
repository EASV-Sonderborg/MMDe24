function NavBar() {
  return (
    <>
        <nav className="navbar">
        <div className="navbar__logo">
            <a href="/">My Portfolio</a>
        </div>
        <ul className="navbar__links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        </nav>
    </>
  );
}

export default NavBar