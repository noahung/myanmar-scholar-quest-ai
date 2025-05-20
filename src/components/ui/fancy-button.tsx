import React from "react";
import clsx from "clsx";

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon: React.ReactNode;
  color?: string; // Tailwind color class, e.g. 'bg-myanmar-maroon'
  asChild?: boolean;
}

export const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ children, icon, color = "bg-myanmar-maroon", asChild = false, className, ...props }, ref) => {
    const Comp: any = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={clsx(
          "relative flex items-center border border-myanmar-maroon rounded-full px-6 py-2 bg-transparent group hover:bg-myanmar-maroon/10 transition font-semibold",
          className
        )}
        {...props}
      >
        <span className="pr-8 text-myanmar-maroon">{children}</span>
        <span
          className={clsx(
            "absolute right-2 flex items-center justify-center w-8 h-8 rounded-full transition",
            color,
            "group-hover:bg-myanmar-gold"
          )}
        >
          <span className="w-5 h-5 text-white flex items-center justify-center">{icon}</span>
        </span>
      </Comp>
    );
  }
);
FancyButton.displayName = "FancyButton"; 