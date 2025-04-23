"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/file-dropzone"
import { Upload } from "lucide-react"

export default function CompanyEmployeeProfileSetupPage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [position, setPosition] = useState(user?.position || "")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!name.trim()) {
      setError("Името е задължително")
      return
    }

    if (!phone.trim()) {
      setError("Телефонният номер е задължителен")
      return
    }

    if (!position.trim()) {
      setError("Позицията е задължителна")
      return
    }

    setIsSubmitting(true)
    try {
      // Update employee profile
      updateUserProfile({
        name,
        phone,
        position,
        profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : undefined,
      })

      // Redirect to company profile setup
      router.push("/company/profile-setup")
    } catch (error) {
      setError("Възникна проблем при настройването на профила")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Настройка на профила</CardTitle>
          <CardDescription>Добре дошли в NSTUES! Моля, попълнете следната информация за вашия профил.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Име и фамилия</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" />
            </div>

            <div className="space-y-2">
              <Label>Профилна снимка (опционално)</Label>
              <FileDropzone
                onFileSelect={(files) => {
                  if (files && files.length > 0) {
                    setProfilePicture(files[0])
                  }
                }}
                acceptedFileTypes={["image/jpeg", "image/png"]}
                label="Качете профилна снимка"
                className="mt-2"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Плъзнете или кликнете, за да качите снимка</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG до 5MB</p>
                </div>
              </FileDropzone>
              {profilePicture && (
                <p className="text-sm text-muted-foreground mt-2">Избран файл: {profilePicture.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефонен номер</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+359 88 888 8888"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Позиция в компанията</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="HR Мениджър"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Запазване..." : "Запази и продължи"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
