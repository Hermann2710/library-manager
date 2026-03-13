"use client"

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, FileText, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export function StatsCharts({
    topBooks = [],
    topAuthors = [],
    topCategories = [],
    topGenres = [],
    topPublishers = []
}: any) {
    const [view, setView] = useState("books");

    // Sélection dynamique de la source de données
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
                headStyles: { fillStyle: '#111' } as any
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        });
        doc.save("rapport_statistiques.pdf");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Tabs defaultValue="books" onValueChange={setView} className="w-full sm:w-auto">
                    <TabsList className="bg-muted/50 border border-muted-foreground/10 h-10 p-1">
                        <TabsTrigger value="books" className="text-[10px] font-bold uppercase tracking-widest px-4">Livres</TabsTrigger>
                        <TabsTrigger value="authors" className="text-[10px] font-bold uppercase tracking-widest px-4">Auteurs</TabsTrigger>
                        <TabsTrigger value="categories" className="text-[10px] font-bold uppercase tracking-widest px-4">Catégories</TabsTrigger>
                        <TabsTrigger value="genres" className="text-[10px] font-bold uppercase tracking-widest px-4">Genres</TabsTrigger>
                        <TabsTrigger value="publishers" className="text-[10px] font-bold uppercase tracking-widest px-4">Éditeurs</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 text-[9px] font-black uppercase tracking-widest">
                        <FileSpreadsheet className="mr-2 h-3.5 w-3.5 text-emerald-600" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportPDF} className="h-9 text-[9px] font-black uppercase tracking-widest">
                        <FileText className="mr-2 h-3.5 w-3.5 text-red-600" /> PDF
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-none bg-muted/5">
                <CardHeader className="flex flex-row items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-black uppercase italic">
                        Analyse par {view}
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-80 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeData} layout="vertical" margin={{ left: 20, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey={dataKey}
                                type="category"
                                width={140}
                                tick={{ fontSize: 9, fontWeight: 800, fill: 'hsl(var(--foreground))' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '11px' }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                {activeData.map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.25)'}
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