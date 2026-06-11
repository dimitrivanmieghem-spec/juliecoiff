"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import { Trash2, Loader2, ImagePlus, Images } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import { uploadPortfolioImage, deletePortfolioImage } from "@/app/actions/portfolio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function withCacheBust(url: string): string {
  return `${url}?t=${Date.now()}`;
}

interface PortfolioImage {
  url: string;
  fileName: string;
}

export default function PortfolioAdmin() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchImages() {
    if (uploading) return;
    setIsLoading(true);
    const { data, error } = await supabase.storage.from("portfolio").list("");
    if (error) console.error("Erreur Supabase List:", error);
    console.log("Fichiers trouvés dans le bucket:", data);
    const validFiles = data?.filter((file) => file.name && file.name !== ".emptyFolderPlaceholder") || [];
    const mapped = validFiles.map((file) => ({
      fileName: file.name,
      url: withCacheBust(supabase.storage.from("portfolio").getPublicUrl(file.name).data.publicUrl),
    }));
    setImages(mapped);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function processImage(originalFile: File): Promise<File | null> {
    try {
      let processableFile = originalFile;
      const isHeic = originalFile.type === "image/heic" || originalFile.name.toLowerCase().endsWith(".heic");

      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const heicBuffer = await originalFile.arrayBuffer();
          const heicBlob = new Blob([heicBuffer], { type: "image/heic" });
          const convertedBlob = await heic2any({ blob: heicBlob, toType: "image/jpeg", quality: 0.8 });
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          processableFile = new File([blob], originalFile.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
          if (errorMsg.includes("already browser readable")) {
            processableFile = originalFile;
          } else {
            console.error("Détail critique du crash HEIC :", err);
            throw new Error("Cette photo HEIC d'Apple utilise un format trop complexe pour être convertie sur PC. Veuillez utiliser une photo JPEG pour garantir l'affichage sur le site.");
          }
        }
      }

      if (!processableFile.type.startsWith("image/")) {
        throw new Error("Le fichier généré n'est pas une image valide pour le web.");
      }

      const compressedBlob = await imageCompression(processableFile, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      });

      return new File(
        [compressedBlob],
        processableFile.name.replace(/\.[^/.]+$/, ".webp"),
        { type: "image/webp" }
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Une erreur inattendue a bloqué le traitement.";
      alert(msg);
      return null;
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const finalFile = await processImage(file);
    if (!finalFile) {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", finalFile);
    const result = await uploadPortfolioImage(formData);
    if (result.url && result.fileName) {
      setImages((prev) => [
        { url: withCacheBust(result.url!), fileName: result.fileName! },
        ...prev,
      ]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(fileName: string) {
    if (!confirm("Supprimer cette photo du portfolio ?")) return;
    startTransition(async () => {
      const result = await deletePortfolioImage(fileName);
      if (!result.error) {
        setImages((prev) => prev.filter((img) => img.fileName !== fileName));
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-lg font-semibold text-primary">
          Photos du portfolio
          {images.length > 0 && (
            <span className="ml-2 text-sm font-sans font-normal text-text-main/40">({images.length})</span>
          )}
        </h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp, image/heic, .heic"
            className="hidden"
            id="portfolio-upload"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label
            htmlFor="portfolio-upload"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all select-none ${
              uploading
                ? "bg-primary/50 text-white cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-sm cursor-pointer"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                Ajouter une photo
              </>
            )}
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-main/40 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Chargement des photos…</span>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-main/40 border-2 border-dashed border-primary/20 rounded-2xl">
          <Images className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">Aucune photo dans le portfolio.</p>
          <p className="text-xs mt-1">Cliquez sur &quot;Ajouter une photo&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.fileName} className="relative aspect-square group rounded-xl overflow-hidden shadow-sm">
              <Image
                src={img.url}
                alt="Portfolio"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <button
                type="button"
                onClick={() => handleDelete(img.fileName)}
                disabled={isPending}
                aria-label="Supprimer"
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
