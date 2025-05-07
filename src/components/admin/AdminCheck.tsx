
// Mock admin check - will be replaced with Supabase auth check
export const useIsAdmin = () => {
  // For now, we'll just return true for demo purposes
  // In production, this would check if the current user is an admin
  return { isAdmin: true, isLoading: false };
};
