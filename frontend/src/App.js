import { Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import CalendarPage from "./pages/CalendarPage";
import FAQPage from "./pages/FAQPage";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./utils/ProtectedRoute";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyCompetitionsPage from "./pages/MyCompetitionsPage";
import CreateCompetitionPage from "./pages/CreateCompetitionPage";
import OrganizationCompetitionDetailsPage from "./pages/OrganizationCompetitionDetailsPage";
import RefereesPage from "./pages/RefereesPage";
import CompetitionDetailsResultsPage from "./pages/CompetitionDetailsResultsPage";

const ROLES = {
  Participant: "Participant",
  Organization: "Organization",
};

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route
              path="/competitions/:id"
              element={<CompetitionDetailsPage />}
            />
            <Route
              path="/competitions/:id/results"
              element={<CompetitionDetailsResultsPage />}
            />
            <Route path="/referees" element={<RefereesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/my_profile"
              element={<ProtectedRoute roles={ROLES} />}
            >
              <Route path="/my_profile" element={<MyProfilePage />}></Route>
            </Route>
            <Route
              path="/my_competitions"
              element={<ProtectedRoute roles={ROLES} />}
            >
              <Route
                path="/my_competitions"
                element={<MyCompetitionsPage />}
              ></Route>
            </Route>
            <Route
              path="/my_competitions/organization/:id"
              element={<ProtectedRoute roles={ROLES.Organization} />}
            >
              <Route
                path="/my_competitions/organization/:id"
                element={<OrganizationCompetitionDetailsPage />}
              ></Route>
            </Route>
            <Route
              path="/my_competitions/organization/create"
              element={<ProtectedRoute roles={ROLES.Organization} />}
            >
              <Route
                path="/my_competitions/organization/create"
                element={<CreateCompetitionPage />}
              ></Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
