
import * as React from "react";
import { useToast as useToastHook } from "@/hooks/use-toast";

// Create a properly scoped toast function that will be safe to use
// without causing the "Cannot read properties of null (reading 'useState')" error
const toastInstance = (() => {
  let _toastFn: ReturnType<typeof useToastHook>["toast"] | null = null;
  
  return {
    // This toast function will check if we have a valid instance before calling
    toast: (props: Parameters<ReturnType<typeof useToastHook>["toast"]>[0]) => {
      if (typeof window !== "undefined" && _toastFn) {
        return _toastFn(props);
      }
      // Return a dummy implementation for SSR or when not initialized
      return { id: "0", dismiss: () => {}, update: () => {} };
    },
    // Method to set the actual toast function from a component
    __setToastFunction: (toastFn: ReturnType<typeof useToastHook>["toast"]) => {
      _toastFn = toastFn;
    }
  };
})();

// Export the hook for use in components
export { useToastHook as useToast };

// Export the toast function for direct usage
export const toast = toastInstance.toast;

// Create a component to initialize the toast function
export function ToastInitializer() {
  const { toast: toastFn } = useToastHook();
  
  React.useEffect(() => {
    toastInstance.__setToastFunction(toastFn);
    return () => {
      // Clean up on unmount
      toastInstance.__setToastFunction(null as any);
    };
  }, [toastFn]);
  
  return null;
}
