
import { useAuth } from "@/context/AuthContext";

// Admin check using the AuthContext
export const useIsAdmin = () => {
  const { user, isLoading, isAdmin } = useAuth();
  
  return { 
    isAdmin: isAdmin, 
    isLoading: isLoading
  };
};
