import { LOGOUT_MUTATION } from "../graphql/mutations/Logout";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Logout() {
  const client = useApolloClient();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [logoutUser, { error }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      setAuth(null);
      localStorage.clear();
      client.clearStore();
      navigate("/login");
    },
  });

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      logoutUser();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <li>
      <button onClick={handleLogout}>Wyloguj się</button>
    </li>
  );
}
