import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "../api/auth";
import { AuthContextType, User, UserRole } from "../types";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authApi.login(email, password);
    if (response.success && response.data) {
      const { user: u, token: t } = response.data;
      setUser(u);
      setToken(t);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "sales"
  ): Promise<void> => {
    const response = await authApi.register(name, email, password, role);
    if (response.success && response.data) {
      const { user: u, token: t } = response.data;
      setUser(u);
      setToken(t);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
