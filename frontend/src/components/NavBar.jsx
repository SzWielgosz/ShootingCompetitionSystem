import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { auth } = useAuth();

  return (
    <nav className="nav">
      <CustomLink to="/" className="site-title">
        Zawody strzeleckie XYZ
      </CustomLink>
      <ul>
        {!auth ? (
          <>
            <CustomLink to="/login">Zaloguj się</CustomLink>
            <CustomLink to="/register">Zarejestruj się</CustomLink>
          </>
        ) : (
          <LogoutButton />
        )}
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

function LogoutButton() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <li>
      <button onClick={handleLogout}>Wyloguj się</button>
    </li>
  );
}
