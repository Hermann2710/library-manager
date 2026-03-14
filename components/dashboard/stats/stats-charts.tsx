"use client"

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, FileText, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useTheme } from "next-themes";

/**
 * StatsCharts Component.
 * An interactive data visualization hub. It supports dynamic switching between 
 * different data sources (Books, Authors, etc.) and provides export capabilities.
 */
export function StatsCharts({
    topBooks = [],
    topAuthors = [],
    topCategories = [],
    topGenres = [],
    topPublishers = []
}: any) {
    const [view, setView] = useState("books");
    const { theme } = useTheme();

    // Mapping view keys to their respective data sources and display labels
    const getActiveData = () => {
        switch (view) {
            case "authors": return topAuthors;
            case "categories": return topCategories;
            case "genres": return topGenres;
            case "publishers": return topPublishers;
            default: return topBooks;
        }
    };

    const activeData = getActiveData();
    const dataKey = view === "books" ? "title" : "name";

    // Theme-aware colors for Recharts to ensure text is visible in both modes
    const chartColors = useMemo(() => ({
        text: theme === "dark" ? "#a1a1aa" : "#4b5563", // zinc-400 or gray-600
        tooltipBg: theme === "dark" ? "#18181b" : "#ffffff",
        tooltipBorder: theme === "dark" ? "#27272a" : "#e4e4e7"
    }), [theme]);

    /**
     * Handles the CSV export for the entire analytics dataset.
     */
    const exportCSV = () => {
        const data = [
            ...topBooks.map((b: any) => ({ Section: "Livre", Nom: b.title, Valeur: b.count })),
            ...topAuthors.map((a: any) => ({ Section: "Auteur", Nom: a.name, Valeur: a.count })),
            ...topCategories.map((c: any) => ({ Section: "Catégorie", Nom: c.name, Valeur: c.count })),
            ...topGenres.map((g: any) => ({ Section: "Genre", Nom: g.name, Valeur: g.count })),
            ...topPublishers.map((p: any) => ({ Section: "Éditeur", Nom: p.name, Valeur: p.count })),
        ];
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `rapport_statistiques.csv`;
        link.click();
    };

    /**
     * Generates a clean PDF report with tables for each analytical section.
     */
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("RAPPORT D'ANALYSE COMPLET", 14, 20);

        const sections = [
            { title: "TOP LIVRES", data: topBooks.map((b: any) => [b.title, b.count]), head: ['Titre', 'Emprunts'] },
            { title: "TOP AUTEURS", data: topAuthors.map((a: any) => [a.name, a.count]), head: ['Auteur', 'Ouvrages'] },
            { title: "CATÉGORIES", data: topCategories.map((c: any) => [c.name, c.count]), head: ['Catégorie', 'Volume'] },
            { title: "GENRES", data: topGenres.map((g: any) => [g.name, g.count]), head: ['Genre', 'Volume'] },
            { title: "ÉDITEURS", data: topPublishers.map((p: any) => [p.name, p.count]), head: ['Éditeur', 'Volume'] }
        ];

        let y = 30;
        sections.forEach((s) => {
            if (s.data.length === 0) return;
            doc.setFontSize(11);
            doc.text(s.title, 14, y + 5);
            autoTable(doc, {
                startY: y + 7,
                head: [s.head],
                body: s.data,
                headStyles: { fillColor: [17, 17, 17] }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        });
        doc.save("rapport_statistiques.pdf");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Control Bar: Tab selection and Export actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Tabs defaultValue="books" onValueChange={setView} className="w-full sm:w-auto">
                    <TabsList className="bg-muted/50 border border-muted-foreground/10 h-10 p-1 rounded-xl">
                        <TabsTrigger value="books" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Livres</TabsTrigger>
                        <TabsTrigger value="authors" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Auteurs</TabsTrigger>
                        <TabsTrigger value="categories" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Catégories</TabsTrigger>
                        <TabsTrigger value="genres" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Genres</TabsTrigger>
                        <TabsTrigger value="publishers" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Éditeurs</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors">
                        <FileSpreadsheet className="mr-2 h-3.5 w-3.5" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportPDF} className="h-9 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors">
                        <FileText className="mr-2 h-3.5 w-3.5" /> PDF
                    </Button>
                </div>
            </div>

            {/* Chart Display: Highlighting data trends with theme-aware visuals */}
            <Card className="border-none shadow-none bg-muted/20 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-2 border-b border-border/40 bg-muted/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-black uppercase italic tracking-widest">
                        Analyse par {view}
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-80 w-full pt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeData} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey={dataKey}
                                type="category"
                                width={120}
                                tick={{ fontSize: 9, fontWeight: 900, fill: chartColors.text, textAnchor: 'end' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                contentStyle={{
                                    backgroundColor: chartColors.tooltipBg,
                                    borderColor: chartColors.tooltipBorder,
                                    borderRadius: '12px',
                                    border: '1px solid',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    color: 'hsl(var(--foreground))'
                                }}
                            />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16}>
                                {activeData.map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'}
                                        className="transition-all duration-500"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}