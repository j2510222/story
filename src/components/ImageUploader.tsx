"use client";

import { useState, useRef, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { Image as ImageIcon, Loader2, X, AlertCircle } from "lucide-react";

export interface UploadedImage {
  storage_path: string;
  public_url: string;
}

interface ImageUploaderProps {
  initialImages?: UploadedImage[];
  diaryId?: string;
}

export default function ImageUploader({ initialImages = [], diaryId }: ImageUploaderProps) {
  const supabase = createClient();
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("로그인이 필요합니다.");
      setIsUploading(false);
      return;
    }

    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        setError(`파일 크기가 너무 큽니다 (5MB 이하만 가능): ${file.name}`);
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const uniqueId = crypto.randomUUID();
      const folder = diaryId ? diaryId : `temp-${crypto.randomUUID().slice(0, 8)}`;
      const storagePath = `${user.id}/${folder}/${uniqueId}.${fileExt}`;

      try {
        const { data, error: uploadError } = await supabase.storage
          .from("diary-images")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from("diary-images")
            .getPublicUrl(storagePath);

          newImages.push({
            storage_path: storagePath,
            public_url: publicUrl,
          });
        }
      } catch (err: any) {
        setError(`이미지 업로드에 실패했습니다: ${err.message || err}`);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const targetImage = images[indexToRemove];
    
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    try {
      await supabase.storage
        .from("diary-images")
        .remove([targetImage.storage_path]);
    } catch (err) {
      console.error("Failed to delete image from storage:", err);
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="imagePaths" value={JSON.stringify(images.map(img => img.storage_path))} />
      <input type="hidden" name="imageUrls" value={JSON.stringify(images.map(img => img.public_url))} />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase text-stone-500 tracking-wider">
          사진 첨부 (최대 5MB)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-stone-250 bg-white px-3 text-xs font-semibold text-stone-700 shadow-sm hover:bg-stone-50 disabled:opacity-50 transition"
        >
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin text-stone-500" />
          ) : (
            <ImageIcon className="size-3.5 text-emerald-800" />
          )}
          사진 추가
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 p-2.5 border border-rose-200 text-xs text-rose-800 font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={img.storage_path} className="group relative aspect-square rounded-lg border border-stone-200 bg-stone-50 overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.public_url}
                alt="첨부 이미지"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
