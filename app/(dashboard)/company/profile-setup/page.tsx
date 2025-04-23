"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Check, ChevronsUpDown, Upload } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileDropzone } from "@/components/file-dropzone"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function CompanyProfileSetupPage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"employee" | "company">("employee")

  // Employee details
  const [employeeName, setEmployeeName] = useState(user?.name || "")
  const [employeePhone, setEmployeePhone] = useState("")
  const [employeePosition, setEmployeePosition] = useState("")
  const [employeeProfilePicture, setEmployeeProfilePicture] = useState<File | null>(null)

  // Company details
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [presentation, setPresentation] = useState<File | null>(null)
  const [plan, setPlan] = useState<File | null>(null)
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactEmail, setContactEmail] = useState(user?.email || "")
  const [contactPhone, setContactPhone] = useState("")
  const [internshipType, setInternshipType] = useState<"online" | "onsite" | "hybrid">("onsite")
  const [positions, setPositions] = useState("1")
  const [requiresCV, setRequiresCV] = useState(true)
  const [requiresMotivationLetter, setRequiresMotivationLetter] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [technologiesOpen, setTechnologiesOpen] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])

  // Common technologies
  const commonTechnologies = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring",
    "C#",
    ".NET",
    "PHP",
    "Laravel",
    "Ruby",
    "Rails",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "HTML",
    "CSS",
    "SASS",
    "LESS",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "GraphQL",
    "REST API",
  ].sort()

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!employeeName.trim()) {
      setError("Името е задължително")
      return
    }

    if (!employeePhone.trim()) {
      setError("Телефонният номер е задължителен")
      return
    }

    if (!employeePosition.trim()) {
      setError("Позицията е задължителна")
      return
    }

    // Move to company details step
    setCurrentStep("company")
    setError(null)
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!name.trim()) {
      setError("Името на компанията е задължително")
      return
    }

    if (!description.trim()) {
      setError("Описанието на компанията е задължително")
      return
    }

    if (!logo) {
      setError("Логото на компанията е задължително")
      return
    }

    if (selectedTechnologies.length === 0) {
      setError("Моля, изберете поне една технология")
      return
    }

    if (specialties.length === 0) {
      setError("Моля, изберете поне една специалност")
      return
    }

    setIsSubmitting(true)
    try {
      // In a real app, we would upload files to storage and get URLs
      const logoUrl = URL.createObjectURL(logo)
      const presentationUrl = presentation ? URL.createObjectURL(presentation) : undefined
      const planUrl = plan ? URL.createObjectURL(plan) : undefined
      const profilePictureUrl = employeeProfilePicture ? URL.createObjectURL(employeeProfilePicture) : undefined

      // Update company profile in a real app
      // For now, just update the user profile to mark it as completed
      updateUserProfile({
        name: employeeName,
        phone: employeePhone,
        position: employeePosition,
        profilePicture: profilePictureUrl,
        profileCompleted: true,
        // We would store company ID here in a real app
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      setError("Възникна проблем при настройването на профила")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSpecialtyChange = (specialty: string) => {
    setSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]))
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      {currentStep === "employee" ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Настройка на профила</CardTitle>
            <CardDescription>
              Добре дошли в NSTUES! Моля, попълнете следната информация за вашия профил.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmployeeSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Име и фамилия</Label>
                <Input
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Иван Иванов"
                />
              </div>

              <div className="space-y-2">
                <Label>Профилна снимка (опционално)</Label>
                <FileDropzone
                  onFileSelect={(files) => {
                    if (files && files.length > 0) {
                      setEmployeeProfilePicture(files[0])
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
                {employeeProfilePicture && (
                  <p className="text-sm text-muted-foreground mt-2">Избран файл: {employeeProfilePicture.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeePhone">Телефонен номер</Label>
                <Input
                  id="employeePhone"
                  value={employeePhone}
                  onChange={(e) => setEmployeePhone(e.target.value)}
                  placeholder="+359 88 888 8888"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeePosition">Позиция в компанията</Label>
                <Input
                  id="employeePosition"
                  value={employeePosition}
                  onChange={(e) => setEmployeePosition(e.target.value)}
                  placeholder="HR Мениджър"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full">
                Продължи към данни за компанията
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Настройка на профила на компанията</CardTitle>
            <CardDescription>
              Моля, попълнете следната информация, за да настроите профила на вашата компания.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompanySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Име на компанията</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Име на компанията"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Уебсайт</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание на компанията</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Кратко описание на компанията"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Лого на компанията</Label>
                <FileDropzone
                  onFileSelect={(files) => {
                    if (files && files.length > 0) {
                      setLogo(files[0])
                    }
                  }}
                  acceptedFileTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                  label="Качете лого"
                  className="mt-2"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Плъзнете или кликнете, за да качите лого</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG до 5MB</p>
                  </div>
                </FileDropzone>
                {logo && <p className="text-sm text-muted-foreground mt-2">Избран файл: {logo.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Специалности</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="software"
                      checked={specialties.includes("Софтуер")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSpecialties((prev) => [...prev, "Софтуер"])
                        } else {
                          setSpecialties((prev) => prev.filter((s) => s !== "Софтуер"))
                        }
                      }}
                    />
                    <label
                      htmlFor="software"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Софтуер
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="networks"
                      checked={specialties.includes("Компютърни мрежи")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSpecialties((prev) => [...prev, "Компютърни мрежи"])
                        } else {
                          setSpecialties((prev) => prev.filter((s) => s !== "Компютърни мрежи"))
                        }
                      }}
                    />
                    <label
                      htmlFor="networks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Компютърни мрежи
                    </label>
                  </div>
                </div>
                {specialties.length === 0 && (
                  <p className="text-sm text-destructive">Моля, изберете поне една специалност.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Технологии, които използвате</Label>
                <p className="text-sm text-muted-foreground">Изберете технологиите, които използвате в компанията.</p>
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
                          {commonTechnologies.map((technology) => (
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
                <Label>Презентация на компанията (опционално)</Label>
                <FileDropzone
                  onFileSelect={(files) => {
                    if (files && files.length > 0) {
                      setPresentation(files[0])
                    }
                  }}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  ]}
                  label="Качете презентация"
                  className="mt-2"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Плъзнете или кликнете, за да качите презентация</p>
                    <p className="text-xs text-muted-foreground">PDF, PPTX до 20MB</p>
                  </div>
                </FileDropzone>
                {presentation && <p className="text-sm text-muted-foreground mt-2">Избран файл: {presentation.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>План за стажа (опционално)</Label>
                <FileDropzone
                  onFileSelect={(files) => {
                    if (files && files.length > 0) {
                      setPlan(files[0])
                    }
                  }}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                  label="Качете план за стажа"
                  className="mt-2"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Плъзнете или кликнете, за да качите план за стажа</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX до 10MB</p>
                  </div>
                </FileDropzone>
                {plan && <p className="text-sm text-muted-foreground mt-2">Избран файл: {plan.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Адрес на компанията"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Лице за контакт</Label>
                  <Input
                    id="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Име на лицето за контакт"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Имейл за контакт</Label>
                  <Input
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Телефон за контакт</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+359 88 888 8888"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Вид на стажа</Label>
                <RadioGroup
                  value={internshipType}
                  onValueChange={(value) => setInternshipType(value as "online" | "onsite" | "hybrid")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onsite" id="onsite" />
                    <Label htmlFor="onsite">Присъствено</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Онлайн</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid">Смесено</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="positions">Брой места за стажанти</Label>
                <Input
                  id="positions"
                  type="number"
                  min="1"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Изисквани документи</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresCV"
                      checked={requiresCV}
                      onCheckedChange={(checked) => setRequiresCV(checked as boolean)}
                    />
                    <Label htmlFor="requiresCV">CV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresMotivationLetter"
                      checked={requiresMotivationLetter}
                      onCheckedChange={(checked) => setRequiresMotivationLetter(checked as boolean)}
                    />
                    <Label htmlFor="requiresMotivationLetter">Мотивационно писмо</Label>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("employee")}>
                  Назад
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Запазване..." : "Запази и продължи"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
