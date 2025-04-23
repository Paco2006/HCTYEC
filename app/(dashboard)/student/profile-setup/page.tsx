"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockCompanies } from "@/lib/mock-data"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileDropzone } from "@/components/file-dropzone"
import { Upload } from "lucide-react"

export default function StudentProfileSetupPage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [technologiesOpen, setTechnologiesOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [github, setGithub] = useState(user?.github || "")
  const [linkedin, setLinkedin] = useState(user?.linkedin || "")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  // Extract unique technologies from all companies
  const allTechnologies = Array.from(new Set(mockCompanies.flatMap((company) => company.technologies))).sort()

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

    if (selectedTechnologies.length === 0) {
      setError("Моля, изберете поне една технология, която ви интересува")
      return
    }

    setIsSubmitting(true)
    try {
      // Update user profile
      updateUserProfile({
        name,
        phone,
        profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : undefined,
        github: github || undefined,
        linkedin: linkedin || undefined,
        technologies: selectedTechnologies,
        profileCompleted: true,
      })

      // Redirect to dashboard
      router.push("/dashboard")
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
          <CardDescription>
            Добре дошли в NSTUES! Моля, попълнете следната информация, за да настроите вашия профил.
          </CardDescription>
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
              <Label>Технологии, които ви интересуват</Label>
              <p className="text-sm text-muted-foreground">Изберете технологиите, които ви интересуват.</p>
              <Popover open={technologiesOpen} onOpenChange={setTechnologiesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={technologiesOpen}
                    className="w-full justify-between mt-2"
                  >
                    {selectedTechnologies.length > 0
                      ? `${selectedTechnologies.length} избрани технологии`
                      : "Изберете технологии"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Търси технология..." />
                    <CommandList>
                      <CommandEmpty>Няма намерени технологии.</CommandEmpty>
                      <CommandGroup>
                        {allTechnologies.map((technology) => (
                          <CommandItem
                            key={technology}
                            value={technology}
                            onSelect={() => {
                              setSelectedTechnologies((prev) =>
                                prev.includes(technology)
                                  ? prev.filter((t) => t !== technology)
                                  : [...prev, technology],
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTechnologies.includes(technology) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {technology}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedTechnologies.length === 0 && (
                <p className="text-sm text-destructive mt-2">Моля, изберете поне една технология.</p>
              )}
            </div>

            {selectedTechnologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTechnologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="github">GitHub профил (опционално)</Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
              <p className="text-sm text-muted-foreground">Вашият GitHub профил URL.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn профил (опционално)</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
              <p className="text-sm text-muted-foreground">Вашият LinkedIn профил URL.</p>
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
