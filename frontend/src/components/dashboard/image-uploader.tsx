"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB por imagem

/**
 * Uploader de imagem com clique OU arrastar-e-soltar (drag & drop).
 * Lê o arquivo como data URL (base64) e devolve via onChange — a imagem é
 * persistida no perfil. Usa a API nativa de DnD do HTML5 (sem biblioteca).
 */
export function ImageUploader({
  label,
  initialUrl,
  aspect = "square",
  onChange
}: {
  label: string;
  initialUrl?: string;
  aspect?: "square" | "banner";
  onChange?: (dataUrl: string | null) => void;
}) {
  const [preview, setPreview] = React.useState<string | undefined>(initialUrl);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function processFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Solte uma imagem (JPG, PNG, WebP…)."
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({
        variant: "destructive",
        title: "Imagem muito grande",
        description: "Escolha um arquivo de até 1,5 MB."
      });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange?.(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    processFile(e.target.files?.[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }

  function clear() {
    setPreview(undefined);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
        className={cn(
          "relative overflow-hidden rounded-lg border border-dashed bg-muted/30 transition-colors",
          aspect === "square" ? "h-32 w-32" : "h-32 w-full",
          dragging && "border-primary ring-2 ring-primary/40 bg-primary/5",
          !preview && "cursor-pointer"
        )}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt={label}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
            {dragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 text-primary">
                <UploadCloud className="h-6 w-6" />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-muted-foreground">
            {dragging ? (
              <>
                <UploadCloud className="h-6 w-6 text-primary" />
                <span className="text-xs text-primary">Solte a imagem aqui</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">Clique ou arraste uma imagem</span>
              </>
            )}
          </div>
        )}
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium text-primary hover:underline"
        >
          Trocar imagem
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
