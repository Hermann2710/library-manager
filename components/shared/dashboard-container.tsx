import { cn } from "@/lib/utils";

interface DashboardContainerProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function DashboardContainer({
    children,
    title,
    subtitle,
    description,
    actions,
    className
}: DashboardContainerProps) {
    return (
        <div className={cn("space-y-8 animate-in fade-in duration-500", className)}>
            {/* Header de la page */}
            {(title || subtitle || actions) && (
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        {subtitle && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                {subtitle}
                            </p>
                        )}
                        {title && (
                            <h1 className="text-3xl font-black uppercase italic leading-none tracking-tight">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </header>
            )}

            {/* Contenu principal */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}