"use client"

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [isDrag, setIsDrag] = useState(false);

    const onUpload = async (file: File) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            onChange(data.url);
        } finally { setLoading(false); }
    };

    return (
        <div className={cn(
            "relative aspect-3/4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition bg-muted/50",
            isDrag ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            className
        )}
            onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onUpload(f); }}
        >
            {value ? (
                <>
                    <img src={value} alt="Cover" className="w-full h-full object-cover" />
                    <Button type="button" onClick={onRemove} variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7">
                        <X className="h-4 w-4" />
                    </Button>
                </>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                    {loading ? <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" /> : (
                        <>
                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">Glissez ou cliquez pour la couverture</p>
                        </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
                </label>
            )}
        </div>
    );
}