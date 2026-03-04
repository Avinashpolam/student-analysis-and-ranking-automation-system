import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({ title, subtitle, actions, children }: PageLayoutProps) => (
  <div className="ml-64 min-h-screen">
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
    <main className="p-8">{children}</main>
  </div>
);

export default PageLayout;
