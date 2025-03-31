import React from 'react';
import { cn } from "@/lib/utils";

interface FontHarryPProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
  children: React.ReactNode;
}

export function FontHarryP({
  level = 1,
  as,
  children,
  className,
  ...props
}: FontHarryPProps) {
  const Component = as || `h${level}`;

  return (
    <Component
      className={cn(
        "font-[HarryP] tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
