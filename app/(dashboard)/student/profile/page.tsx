"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { Upload } from "lucide-react"

export default function StudentProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [classSection, setClassSection] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setGithub(user.github || "")
      setLinkedin(user.linkedin || "")
      setClassSection(user.classSection || "")
      setTechnologies(user.technologies || [])
      setProfilePicture(user.profilePicture || null)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      updateUserProfile({
        name,
        phone,
        github: github || undefined,
        linkedin: linkedin || undefined,
        classSection,
        technologies,
        profilePicture: newProfilePicture ? URL.createObjectURL(newProfilePicture) : profilePicture,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Профил</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Лична информация</CardTitle>
            <CardDescription>Управлявайте вашата лична информация.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Име и фамилия</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефонен номер</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classSection">Паралелка</Label>
                  <Select value={classSection} onValueChange={setClassSection}>
                    <SelectTrigger id="classSection">
                      <SelectValue placeholder="Изберете паралелка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="А">11 А</SelectItem>
                      <SelectItem value="Б">11 Б</SelectItem>
                      <SelectItem value="В">11 В</SelectItem>
                      <SelectItem value="Г">11 Г</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Профилна снимка</Label>
                  <FileDropzone
                    onFileSelect={(files) => {
                      if (files && files.length > 0) {
                        setNewProfilePicture(files[0])
                      }
                    }}
                    acceptedFileTypes={["image/jpeg", "image/png"]}
                    currentFile={profilePicture || undefined}
                    className="mt-2"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Плъзнете или кликнете, за да качите снимка</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG до 5MB</p>
                    </div>
                  </FileDropzone>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub профил</Label>
                  <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn профил</Label>
                  <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Отказ
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Запазване..." : "Запази"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Име и фамилия</h3>
                    <p className="mt-1">{name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Имейл</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Телефонен номер</h3>
                    <p className="mt-1">{phone || "Не е посочен"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Паралелка</h3>
                    <p className="mt-1">{classSection ? `11 ${classSection}` : "Не е посочена"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">GitHub профил</h3>
                    <p className="mt-1">
                      {github ? (
                        <a
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {github}
                        </a>
                      ) : (
                        "Не е посочен"
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">LinkedIn профил</h3>
                    <p className="mt-1">
                      {linkedin ? (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {linkedin}
                        </a>
                      ) : (
                        "Не е посочен"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Технологии</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies && technologies.length > 0 ? (
                      technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Няма избрани технологии</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setIsEditing(true)}>Редактирай</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Профилна снимка</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt={name}
                className="w-40 h-40 rounded-full object-cover border"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">{name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
