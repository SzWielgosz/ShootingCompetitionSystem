import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <CustomLink to="/" className="site-title">
        Zawody strzeleckie XYZ
      </CustomLink>
      <ul>
        <CustomLink to="/login">Zaloguj się</CustomLink>
        <CustomLink to="/register">Zarejestruj się</CustomLink>
        <CustomLink to="/calendar">Kalendarz</CustomLink>
        <CustomLink to="/about">O nas</CustomLink>
        <CustomLink to="/contact">Kontakt</CustomLink>
        <CustomLink to="/faq">FAQ</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
