"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FileDropzoneProps {
  onFileSelect: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
  maxSize?: number
  label?: string
  className?: string
  children?: React.ReactNode
  currentFile?: string
}

export function FileDropzone({
  onFileSelect,
  acceptedFileTypes = ["image/*", "application/pdf"],
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  label = "Качете файл",
  className,
  children,
  currentFile,
}: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        // If we have a preview from a previous file, revoke its object URL
        if (preview && !currentFile) {
          URL.revokeObjectURL(preview)
        }

        // Create a preview for the first file if it's an image
        if (acceptedFiles[0].type.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(acceptedFiles[0])
          setPreview(previewUrl)
        }

        // Call the callback with the accepted files
        onFileSelect(acceptedFiles)
      }
    },
    [onFileSelect, preview, currentFile],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxFiles,
    maxSize,
  })

  const removeFile = () => {
    if (preview && !currentFile) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onFileSelect([])
  }

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative">
          {preview.startsWith("data:image") || preview.startsWith("blob:") || preview.includes("/images/") ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Файлът е качен</span>
              <Button type="button" variant="destructive" size="sm" onClick={removeFile}>
                Премахни
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
            isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25",
            className,
          )}
        >
          <input {...getInputProps()} />
          {children || (
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">Плъзнете файл тук или кликнете, за да изберете</div>
            </div>
          )}
        </div>
      )}
      {fileRejections.length > 0 && (
        <div className="text-sm text-destructive">
          {fileRejections[0].errors[0].code === "file-too-large"
            ? `Файлът е твърде голям. Максимален размер: ${maxSize / 1024 / 1024}MB`
            : fileRejections[0].errors[0].code === "file-invalid-type"
              ? "Невалиден тип файл"
              : fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  )
}
