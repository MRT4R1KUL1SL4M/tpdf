import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-[#292722]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-md border border-[#E9E3DA] bg-white px-3.5 py-2 text-sm text-[#292722] placeholder:text-[#81786E] transition-colors focus:border-[#B78360] focus:outline-none focus:ring-1 focus:ring-[#B78360] disabled:bg-[#F7F4EE] disabled:opacity-50",
            error && "border-[#E05252] focus:border-[#E05252] focus:ring-[#E05252]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#9E2A2B]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

