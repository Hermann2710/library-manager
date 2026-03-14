import { cn } from "@/lib/utils";

interface DashboardContainerProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

/**
 * DashboardContainer Component.
 * This is the standard shell for every page inside the dashboard. 
 * It handles the page title, descriptions, and action buttons in a consistent way.
 */
export function DashboardContainer({
    children,
    title,
    subtitle,
    description,
    actions,
    className
}: DashboardContainerProps) {
    return (
        <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>

            {/* Page Header:
                It dynamically arranges title info and action buttons. 
                The layout shifts from column to row on larger screens.
            */}
            {(title || subtitle || actions) && (
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 border-border/40">
                    <div className="space-y-1.5">
                        {/* Subtitle: Highlighting the category with a bold, uppercase look */}
                        {subtitle && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 animate-in fade-in duration-700">
                                {subtitle}
                            </p>
                        )}

                        {/* Title: Strong, italic, and uppercase for that modern 'LibManager' punch */}
                        {title && (
                            <h1 className="text-3xl font-black uppercase italic leading-none tracking-tight text-foreground">
                                {title}
                            </h1>
                        )}

                        {/* Description: Useful for guiding users on what this specific section does */}
                        {description && (
                            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Actions: This is where we inject buttons like 'Add New', 'Export', etc. */}
                    {actions && (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-500 delay-150">
                            {actions}
                        </div>
                    )}
                </header>
            )}

            {/* Main Content:
                The core page content is rendered here, filling the available width.
            */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}