/**
 * File handling utilities for base64 encoding, 5MB validation, and downloading
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB default

/**
 * Validates if the selected file is within the 5MB limit
 */
export function validateFileSize(file: File, maxBytes = MAX_FILE_SIZE_BYTES): { valid: boolean; error?: string } {
  if (file.size > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
    const actualMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${actualMb} MB) exceeds the maximum allowed limit of ${maxMb} MB.`
    };
  }
  return { valid: true };
}

/**
 * Formats byte size into human readable string (e.g. 1.2 MB, 450 KB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes)) return "0 B";
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes} B`;
}

/**
 * Reads a File object and converts it to a Base64 data URL string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to encode file as base64 string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Triggers a client-side file download from a Base64 data string or file URL
 */
export function downloadBase64File(base64Data: string, filename: string): void {
  try {
    if (!base64Data) {
      console.warn("No data provided for download");
      return;
    }

    // If it's a relative or absolute URL endpoint (like /api/v1/catalog/media/...)
    if (base64Data.startsWith("/") || base64Data.startsWith("http")) {
      const link = document.createElement("a");
      link.href = base64Data;
      link.download = filename || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Handle data URL (data:image/png;base64,... or raw base64)
    let mimeType = "application/octet-stream";
    let base64Content = base64Data;

    if (base64Data.startsWith("data:")) {
      const parts = base64Data.split(";base64,");
      mimeType = parts[0].replace("data:", "");
      base64Content = parts[1] || "";
    }

    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename || "download";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.error("Error triggering base64 file download:", err);
    // Fallback: window.open
    if (base64Data.startsWith("data:")) {
      const win = window.open();
      if (win) win.document.write(`<iframe src="${base64Data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  }
}
