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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: uploadToApi,
    onSuccess: () => {
      setPreview(null);
      setPendingFile(null);
      setShowConfirmDialog(false);
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
      setShowConfirmDialog(false);
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

    setShowConfirmDialog(true);
  }, []);

  const confirmUpload = useCallback(() => {
    if (!pendingFile) return;
    uploadMutation.mutate(pendingFile);
  }, [pendingFile, uploadMutation]);

  const cancelUpload = useCallback(() => {
    setPendingFile(null);
    setPreview(null);
    setShowConfirmDialog(false);
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
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary"}
          ${uploadMutation.isPending ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-w-full max-h-48 mx-auto rounded-lg" />
            {uploadMutation.isPending && (
              <div className="space-y-2">
                <div className="text-sm text-base-content/70">Uploading...</div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" />
                </div>
              </div>
            )}
            {!uploadMutation.isPending && (
              <div className="text-sm text-base-content/70">
                Ready to upload: {pendingFile?.name}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📸</div>
            <div>
              {isDragActive ? (
                <p className="text-primary font-medium">Drop the shiba image here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Drag & drop a shiba image here</p>
                  <p className="text-sm text-base-content/70">or click to select</p>
                </div>
              )}
            </div>
            <div className="text-xs text-base-content/50">
              Supports: JPEG, PNG, GIF, WebP (max 5MB)
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {uploadMutation.isSuccess && !error && (
        <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded-lg">
          <p className="success text-sm">🎉 Shiba uploaded successfully!</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && !uploadMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg p-6 max-w-sm w-full space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Shiba Upload</h3>
              <div className="space-y-2">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-32 mx-auto rounded-lg"
                  />
                )}
                <p className="text-sm text-base-content/70">File: {pendingFile?.name}</p>
                <p className="text-sm text-base-content/70">
                  Size: {pendingFile ? (pendingFile.size / 1024 / 1024).toFixed(2) : "0"} MB
                </p>
                <p className="text-sm text-base-content/60">
                  Are you sure you want to upload this shiba image?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelUpload}
                className="flex-1 px-4 py-2 btn btn-outline"
                disabled={uploadMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 px-4 py-2 btn btn-primary"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Uploading...
                  </>
                ) : (
                  "Upload Shiba 🐕"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
