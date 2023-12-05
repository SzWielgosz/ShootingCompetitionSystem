import { Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import ContactPage from "./pages/ContactPage";
import CalendarPage from "./pages/CalendarPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./utils/ProtectedRoute";
import CompetitionDetailsPage from "./pages/CompetitionDetailsPage";
import MyProfilePage from "./pages/MyProfilePage";

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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/my_profile"
              element={<ProtectedRoute roles={ROLES} />}
            >
              <Route path="/my_profile" element={<MyProfilePage />}></Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
