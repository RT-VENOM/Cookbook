import { createContext, useContext, useState, useEffect, useRef } from "react"; // Added useRef
import { getRequest } from "@/lib/api";
import { API } from "@/lib/routes";
import { InitialLoadingScreen } from "./loading-screen";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedSession = useRef(false); // <--- This prevents the double-fire

  useEffect(() => {
    // Only run if we haven't checked yet
    if (hasCheckedSession.current) return;

    const checkSession = async () => {
      hasCheckedSession.current = true; // Lock it
      try {
        const response = await getRequest(API.ME);
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated: !!user, isLoading }}
    >
      {isLoading ? <InitialLoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
