'use client';

import { useState, useEffect } from "react";

/**
 * AnimatedCounter Component.
 * Animates a numeric value from 0 to the target number.
 */
function AnimatedCounter({ value, duration = 2000 }: { value: string, duration?: number }) {
    // Extract the numeric part (e.g., "50" from "50k+")
    const numericTarget = parseInt(value.replace(/[^0-9]/g, ""));
    const suffix = value.replace(/[0-9]/g, "");
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;

        // Animation logic based on performance.now() for smooth transitions
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * numericTarget));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [numericTarget, duration]);

    return <span>{count}{suffix}</span>;
}

/**
 * Stats Component with animated counters.
 */
export function Stats() {
    const stats = [
        { label: "Livres gérés", value: "50k" },
        { label: "Utilisateurs actifs", value: "12k" },
        { label: "Prêts automatisés", value: "100k" },
        { label: "Précision IA", value: "99%" },
    ];

    return (
        <section className="py-12 border-y bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="space-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                <AnimatedCounter value={stat.value} />
                            </p>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}