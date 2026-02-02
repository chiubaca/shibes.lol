import clsx from "clsx";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

interface ImageUploadProps {
  onUploadSuccess?: () => void;
}

async function uploadToApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string };
    throw new Error(errorData.error || `Upload failed with status ${response.status}`);
  }

  const result = (await response.json()) as {
    success: boolean;
    imageRef: string;
    submission: any;
  };

  if (!result?.success) {
    throw new Error("Upload failed");
  }

  return result;
}

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadToApi,
    onSuccess: () => {
      setPreview(null);
      setPendingFile(null);
      const modal = document.getElementById("image_upload_modal") as HTMLDialogElement;
      modal?.close();
      router.invalidate();
      onUploadSuccess?.();
    },
    onError: (err) => {
      console.error("Upload error:", err);
      let errorMessage = "Upload failed";

      if (err instanceof Error) {
        if (err.message.includes("401")) {
          errorMessage = "Please log in to upload images.";
        } else if (err.message.includes("403")) {
          errorMessage = "Permission denied. Please check your account.";
        } else if (err.message.includes("413")) {
          errorMessage = "File too large. Maximum size is 5MB.";
        } else if (err.message.includes("415")) {
          errorMessage = "Unsupported file type. Please use JPEG, PNG, GIF, or WebP.";
        } else if (err.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Upload timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setPreview(null);
      setPendingFile(null);
      const modal = document.getElementById("image_upload_modal") as HTMLDialogElement;
      modal?.close();
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setError(null);
    setPendingFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    const modal = document.getElementById("image_upload_modal") as HTMLDialogElement;
    modal?.showModal();
  }, []);

  const confirmUpload = useCallback(() => {
    if (!pendingFile) return;
    uploadMutation.mutate(pendingFile);
  }, [pendingFile, uploadMutation]);

  const cancelUpload = useCallback(() => {
    setPendingFile(null);
    setPreview(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop,
    disabled: uploadMutation.isPending,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={clsx(
          "relative overflow-hidden rounded-2xl border-3 border-dashed p-6 text-center cursor-pointer transition-all duration-300",
          isDragActive && "border-orange-400 bg-orange-50 scale-105 shadow-lg shadow-orange-200",
          !isDragActive &&
            "border-orange-200 bg-orange-50/50 hover:border-orange-400 hover:scale-[1.02] hover:shadow-md",
          uploadMutation.isPending && "cursor-not-allowed opacity-60 scale-100",
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-40 mx-auto rounded-xl shadow-md"
              />
              <div className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                Preview ✨
              </div>
            </div>
            {uploadMutation.isPending && (
              <div className="space-y-2">
                <div className="text-sm text-orange-700 font-medium flex items-center justify-center gap-2">
                  <span className="animate-bounce">⏳</span> Uploading...
                </div>
                <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            )}
            {!uploadMutation.isPending && (
              <div className="text-sm text-orange-600 bg-orange-100 rounded-lg px-3 py-2 inline-block">
                📁 {pendingFile?.name}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div
              className={clsx(
                "text-5xl transition-transform duration-300",
                isDragActive && "animate-bounce scale-110",
              )}
            >
              {isDragActive ? "🐕‍🦺" : "🐾"}
            </div>
            <div>
              {isDragActive ? (
                <p className="text-orange-600 font-bold text-lg animate-pulse">
                  Drop that good boy here! 🎯
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="font-bold text-orange-700 text-lg">Share your shibe! 📸</p>
                  <p className="text-sm text-orange-500">Drag & drop or click to select</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-orange-400 bg-orange-100 rounded-full px-4 py-1.5 inline-block">
              <span>📋</span>
              <span>JPEG, PNG, GIF, WebP up to 5MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
          <div className="flex items-center gap-2">
            <span className="text-xl">😿</span>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {uploadMutation.isSuccess && !error && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-bounce">
          <div className="flex items-center gap-2">
            <p className="text-green-600 font-medium text-center w-full">
              🎉 great success! thanks for sharing! 🫶🏼
            </p>
          </div>
        </div>
      )}

      <dialog id="image_upload_modal" className="modal">
        <div className="modal-box w-11/12 max-w-sm">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold">Ready to share?</h3>
            <div className="space-y-2 bg-base-200 rounded-xl p-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-36 mx-auto rounded-lg shadow-sm"
                />
              )}
              <p className="text-sm font-medium">{pendingFile?.name}</p>
              <p className="text-xs opacity-50">
                {pendingFile ? `${(pendingFile.size / 1024 / 1024).toFixed(2)} MB` : "0 MB"}
              </p>
            </div>
          </div>
          <div className="modal-action mt-4">
            <form method="dialog" className="flex gap-3 w-full">
              <button
                onClick={cancelUpload}
                className="flex-1 btn btn-outline"
                disabled={uploadMutation.isPending}
              >
                Maybe later 😔
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 btn bg-orange-400 hover:bg-orange-500 text-white border-none"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    Uploading...
                  </span>
                ) : (
                  "Upload! 🚀"
                )}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={cancelUpload}>close</button>
        </form>
      </dialog>
    </div>
  );
}
