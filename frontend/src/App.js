import { Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Calendar from "./pages/Calendar";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./utils/ProtectedRoute";
import MyProfile from "./pages/MyProfile";

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />}></Route>
            <Route
              path="/my_profile"
              element={<ProtectedRoute roles={ROLES} />}
            >
              <Route path="/my_profile" element={<MyProfile />}></Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
