import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const PageHeader = ({ eyebrow, title, description, children, className }: PageHeaderProps) => (
  <div className={`container mx-auto px-4 pt-10 pb-6 ${className ?? ""}`}>
    <div className="max-w-3xl space-y-3">
      {eyebrow && (
        <p className="text-sm uppercase tracking-wide text-accent font-semibold">{eyebrow}</p>
      )}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  </div>
);
