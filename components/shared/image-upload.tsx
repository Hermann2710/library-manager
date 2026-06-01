"use client"

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    className?: string;
}

/**
 * ImageUpload Component.
 * Optimized for immediate visual feedback. 
 * Uses standard <img> tag to ensure visibility across all environments.
 */
export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [isDrag, setIsDrag] = useState(false);

    /**
     * onUpload:
     * Handles the asynchronous file transfer to the server.
     */
    const onUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Veuillez selectionner une image");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url);
            toast.success("Image envoyee sur Cloudinary");
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cn(
                /* Maintain the 3/4 or 4/5 aspect ratio to match your previous design */
                "relative aspect-3/4 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden",
                isDrag ? "border-primary bg-primary/5 scale-[0.98]" : "border-muted-foreground/25 bg-muted/50",
                className
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDrag(false);
                const file = e.dataTransfer.files?.[0];
                if (file) onUpload(file);
            }}
        >
            {value ? (
                /* Using standard <img> instead of next/image to avoid 
                   configuration issues during development.
                */
                <div className="relative w-full h-full group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                        type="button"
                        onClick={onRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-lg"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 rounded-2xl bg-background shadow-sm mb-3">
                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Glissez ou cliquez
                                </p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold opacity-60">
                                    pour la couverture
                                </p>
                            </div>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(file);
                        }}
                    />
                </label>
            )}
        </div>
    );
}
