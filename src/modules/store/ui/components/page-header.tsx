import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const PageHeader = ({ title, description, className }: PageHeaderProps) => {
  return (
    <div className={cn("relative pt-32 pb-20 bg-surface-dark text-surface-dark-foreground overflow-hidden", className)}>
      <div className="absolute inset-0 bg-linear-to-t from-surface-dark via-surface-dark/60 to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg md:text-xl text-surface-dark-foreground/70 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
