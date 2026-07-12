import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const { login, register, logout, loginGoogle, user, isAuthenticated, isLoading } =
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

  const handleGoogleLogin = async (code: string, redirectUri: string) => {
    await loginGoogle(code, redirectUri);
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
    loginGoogle: handleGoogleLogin,
    logout: handleLogout,
  };
}
