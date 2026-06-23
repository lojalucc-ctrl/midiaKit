"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB por imagem

/**
 * Uploader de imagem. Lê o arquivo como data URL (base64) e devolve a string
 * via onChange — assim a imagem é salva de fato no perfil (persistida no banco).
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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

  function clear() {
    setPreview(undefined);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-dashed bg-muted/30",
          aspect === "square" ? "h-32 w-32" : "h-32 w-full"
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
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Selecionar imagem</span>
          </button>
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
