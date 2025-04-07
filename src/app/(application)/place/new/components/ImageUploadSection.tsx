"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "~/utils/uploadthing";
import { ImageIcon, Upload, X, Plus } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

interface ImageUploadSectionProps {
  mainPhotoUrl: string;
  setMainPhotoUrl: (url: string) => void;
  gallery: string[];
  setGallery: (urls: string[]) => void;
  mainPhotoError?: string;
  clearMainPhotoError: () => void;
  setIsMainPhotoUploading: (isUploading: boolean) => void;
  setIsGalleryUploading: (isUploading: boolean) => void;
}

export default function ImageUploadSection({
  mainPhotoUrl,
  setMainPhotoUrl,
  gallery,
  setGallery,
  mainPhotoError,
  clearMainPhotoError,
  setIsMainPhotoUploading,
  setIsGalleryUploading,
}: ImageUploadSectionProps) {
  function removeGalleryImage(index: number) {
    setGallery(gallery.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <Separator className="my-6" />

      <div>
        <Label className="mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <ImageIcon className="h-4 w-4 text-amber-500" />
          Fotografie principală
        </Label>

        {mainPhotoUrl ? (
          <div className="relative mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={mainPhotoUrl || "/placeholder.svg"}
                alt="Main preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-2 top-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setMainPhotoUrl("")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                mainPhotoError
                  ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
              }`}
            >
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Încărcați o fotografie principală
              </p>
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG sau WEBP (max. 4MB)
              </p>

              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.ufsUrl) {
                    setMainPhotoUrl(res[0].ufsUrl);
                    clearMainPhotoError();
                  }
                  setIsMainPhotoUploading(false);
                }}
                onUploadBegin={() => {
                  setIsMainPhotoUploading(true);
                }}
                className="ut-button:bg-amber-500 ut-button:hover:bg-amber-600 ut-button:text-white ut-button:rounded-md ut-button:font-medium"
              />

              {mainPhotoError && (
                <p className="mt-2 text-sm text-red-500">{mainPhotoError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <Label className="mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <ImageIcon className="h-4 w-4 text-amber-500" />
          Galerie (opțional)
        </Label>

        {gallery.length > 0 && (
          <div className="mb-4 mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  onClick={() => removeGalleryImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res
                    .map((file) => file.ufsUrl)
                    .filter((url): url is string => !!url);
                  setGallery([...gallery, ...urls]);
                  setIsGalleryUploading(false);
                }}
                onUploadBegin={() => {
                  setIsGalleryUploading(true);
                }}
                className="ut-button:bg-gray-200 ut-button:hover:bg-gray-300 ut-button:text-gray-700 ut-button:rounded-full ut-button:h-10 ut-button:w-10 ut-button:p-0 ut-button:flex ut-button:items-center ut-button:justify-center dark:ut-button:bg-gray-700 dark:ut-button:hover:bg-gray-600 dark:ut-button:text-gray-300"
                content={{
                  button: <Plus className="h-5 w-5" />,
                }}
              />
            </div>
          </div>
        )}

        {gallery.length === 0 && (
          <div className="mt-2">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Încărcați imagini pentru galerie
              </p>
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG sau WEBP (max. 4MB)
              </p>

              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res
                    .map((file) => file.ufsUrl)
                    .filter((url): url is string => !!url);
                  setGallery(urls);
                  setIsGalleryUploading(false);
                }}
                onUploadBegin={() => {
                  setIsGalleryUploading(true);
                }}
                className="ut-button:bg-amber-500 ut-button:hover:bg-amber-600 ut-button:text-white ut-button:rounded-md ut-button:font-medium"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
