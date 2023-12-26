import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../hooks/useAuth";
import Logout from "./Logout";
import logoImage from "../images/logo2.png";

export default function Navbar() {
  const { auth } = useAuth();

  return (
    <div>
      <nav className="navHorizontal">
        <ul>
          {!auth ? (
            <>
              <CustomLink to="/login">Zaloguj się</CustomLink>
              <CustomLink to="/register">Zarejestruj się</CustomLink>
            </>
          ) : (
            <>
              <CustomLink to="/my_profile">Mój profil</CustomLink>
              <CustomLink to="/my_competitions">Moje zawody</CustomLink>
              <Logout />
            </>
          )}
        </ul>
      </nav>
      <nav className="navVertical">
        <ul>
          <img src={logoImage} alt="Logo" className="logo" />
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/calendar">Kalendarz</CustomLink>
          <CustomLink to="/referees">Sędziowie</CustomLink>
          <CustomLink to="/faq">FAQ</CustomLink>
        </ul>
      </nav>
    </div>
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
