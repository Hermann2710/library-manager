"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, FileText, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

type StatPoint = {
  _id?: string;
  title?: string;
  name?: string;
  count: number;
};

type StatsChartsProps = {
  topBooks?: StatPoint[];
  topAuthors?: StatPoint[];
  topCategories?: StatPoint[];
  topGenres?: StatPoint[];
  topPublishers?: StatPoint[];
};

type ChartView = "books" | "authors" | "categories" | "genres" | "publishers";

const views: Record<ChartView, { label: string; exportLabel: string; nameKey: "title" | "name"; empty: string }> = {
  books: { label: "Livres", exportLabel: "Livre", nameKey: "title", empty: "Aucun emprunt de livre pour le moment." },
  authors: { label: "Auteurs", exportLabel: "Auteur", nameKey: "name", empty: "Aucun auteur classe pour le moment." },
  categories: { label: "Categories", exportLabel: "Categorie", nameKey: "name", empty: "Aucune categorie classee pour le moment." },
  genres: { label: "Genres", exportLabel: "Genre", nameKey: "name", empty: "Aucun genre classe pour le moment." },
  publishers: { label: "Editeurs", exportLabel: "Editeur", nameKey: "name", empty: "Aucun editeur classe pour le moment." },
};

const fills = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function getName(point: StatPoint, key: "title" | "name") {
  return point[key] || "Non renseigne";
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      <p className="max-w-60 truncate text-xs font-black">{label}</p>
      <p className="mt-1 text-[11px] font-bold text-primary">{payload[0].value} occurence(s)</p>
    </div>
  );
}

export function StatsCharts({
  topBooks = [],
  topAuthors = [],
  topCategories = [],
  topGenres = [],
  topPublishers = [],
}: StatsChartsProps) {
  const [view, setView] = useState<ChartView>("books");

  const datasets = useMemo(
    () => ({
      books: topBooks,
      authors: topAuthors,
      categories: topCategories,
      genres: topGenres,
      publishers: topPublishers,
    }),
    [topAuthors, topBooks, topCategories, topGenres, topPublishers],
  );

  const activeConfig = views[view];
  const activeData = datasets[view].map((point) => ({
    label: getName(point, activeConfig.nameKey),
    count: point.count,
  }));
  const total = activeData.reduce((sum, item) => sum + item.count, 0);
  const leader = activeData[0];

  function exportCSV() {
    const rows = (Object.keys(views) as ChartView[]).flatMap((key) =>
      datasets[key].map((point) => ({
        Section: views[key].exportLabel,
        Nom: getName(point, views[key].nameKey),
        Valeur: point.count,
      })),
    );
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rapport_statistiques.csv";
    link.click();
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Rapport d'analyse BiblioGest", 14, 20);

    let y = 30;
    (Object.keys(views) as ChartView[]).forEach((key) => {
      const rows = datasets[key].map((point) => [getName(point, views[key].nameKey), point.count]);
      if (!rows.length) return;

      doc.setFontSize(11);
      doc.text(views[key].label.toUpperCase(), 14, y + 5);
      autoTable(doc, {
        startY: y + 7,
        head: [[views[key].label, "Valeur"]],
        body: rows,
        headStyles: { fillColor: [35, 92, 67] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save("rapport_statistiques.pdf");
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs value={view} onValueChange={(value) => setView(value as ChartView)} className="min-w-0">
          <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg bg-muted/50 p-1 sm:grid-cols-5">
            {(Object.keys(views) as ChartView[]).map((key) => (
              <TabsTrigger key={key} value={key} className="rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                {views[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 rounded-md font-bold">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} className="h-9 rounded-md font-bold">
            <FileText className="mr-2 h-4 w-4 text-red-600" /> PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <TrendingUp className="h-5 w-5 text-primary" />
                Classement {activeConfig.label.toLowerCase()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Lecture des volumes les plus representes dans les donnees de la librairie.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:min-w-56">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                <p className="mt-1 text-2xl font-black">{total}</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leader</p>
                <p className="mt-1 truncate text-sm font-black">{leader?.label || "Aucun"}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {activeData.length ? (
            <div className="h-88 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData} layout="vertical" margin={{ top: 8, right: 36, bottom: 8, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={132}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip cursor={{ fill: "var(--muted)" }} content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                    {activeData.map((item, index) => (
                      <Cell key={`${item.label}-${index}`} fill={fills[index % fills.length]} />
                    ))}
                    <LabelList dataKey="count" position="right" className="fill-foreground text-xs font-black" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">{activeConfig.empty}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
