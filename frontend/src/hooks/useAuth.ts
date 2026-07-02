import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const { login, register, logout, user, isAuthenticated, isLoading } =
    useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate("/");
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    await register(email, password, name);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
