import { createContext, useContext, useState, useEffect } from "react";
import { getRequest } from "@/lib/api";
import { API } from "@/lib/routes";
import { InitialLoadingScreen } from "@/components/loading-screen"; // 1. Import the new screen

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Wrapper
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This runs exactly once when the app is first opened or refreshed
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await getRequest(API.ME);
        setUser(response.user); // The backend recognized the cookie!
      } catch (error) {
        setUser(null); // No valid cookie found
      } finally {
        setIsLoading(false); // Stop the loading spinner
      }
    };

    checkSession();
  }, []);

  // Expose these tools to the rest of the app
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 2. Swap the basic div for the premium animated screen */}
      {isLoading ? <InitialLoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export const useAuth = () => useContext(AuthContext);