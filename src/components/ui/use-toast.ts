
import { useToast } from "@/hooks/use-toast";

// Export as-is from the hooks directory to avoid duplicate toasts
export { useToast };

// Export the toast function to allow direct usage
export const toast = useToast().toast;
