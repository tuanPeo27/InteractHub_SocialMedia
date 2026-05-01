import * as React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`
          w-full
          rounded-md
          border
          border-gray-300
          px-3
          py-2
          text-sm
          outline-none
          focus:ring-2
          focus:ring-blue-500
          disabled:opacity-50
          ${className || ""}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };