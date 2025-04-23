"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockCompanies } from "@/lib/mock-data"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import Image from "next/image"

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [technologiesOpen, setTechnologiesOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    classSection: "",
    github: "",
    linkedin: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password form errors
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Extract unique technologies from all companies
  const allTechnologies = Array.from(new Set(mockCompanies.flatMap((company) => company.technologies))).sort()

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        classSection: user.classSection || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
      })
      setSelectedTechnologies(user.technologies || [])
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Текущата парола е задължителна"
    } else if (passwordData.currentPassword.length < 6) {
      errors.currentPassword = "Паролата трябва да бъде поне 6 символа"
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Новата парола е задължителна"
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Паролата трябва да бъде поне 6 символа"
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Моля, потвърдете новата парола"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Паролите не съвпадат"
    }

    setPasswordErrors(errors)
    return !errors.currentPassword && !errors.newPassword && !errors.confirmPassword
  }

  const onProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user?.role === "student" && selectedTechnologies.length === 0) {
      toast({
        title: "Грешка",
        description: "Моля, изберете поне една технология, която ви интересува.",
        variant: "destructive",
      })
      return
    }

    setIsProfileSubmitting(true)
    try {
      // Update user profile
      updateUserProfile({
        ...formData,
        technologies: selectedTechnologies,
      })

      toast({
        title: "Профилът е обновен",
        description: "Вашият профил беше успешно обновен.",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при обновяването на профила.",
        variant: "destructive",
      })
    } finally {
      setIsProfileSubmitting(false)
    }
  }

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsPasswordSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Паролата е променена",
        description: "Вашата парола беше успешно променена.",
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при промяната на паролата.",
        variant: "destructive",
      })
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  if (!user) return null

  // Make sure admin users can access this page too

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профил</h1>
        <p className="text-muted-foreground">Управлявайте вашия профил и настройки.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Вашият профил</CardTitle>
            <CardDescription>Преглед на информацията за вашия профил.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {user.profilePicture ? (
              <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden">
                <Image src={user.profilePicture || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
              </div>
            ) : (
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            )}
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            {user.role === "student" && user.classSection && (
              <p className="text-sm text-muted-foreground mt-1">11 {user.classSection}</p>
            )}
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "student"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {user.role === "admin" ? "Администратор" : user.role === "student" ? "Ученик" : "Компания"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">
                Профил
              </TabsTrigger>
              <TabsTrigger value="password" className="flex-1">
                Парола
              </TabsTrigger>
              {user.role === "company" && (
                <TabsTrigger value="company" className="flex-1">
                  Компания
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Информация за профила</CardTitle>
                  <CardDescription>Редактирайте вашата профилна информация.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onProfileSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Име</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Вашето име"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        Това е вашето име, което ще се показва на другите.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Имейл</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Вашият имейл"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">Имейлът не може да бъде променен.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефонен номер</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+359 88 888 8888"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    {user.role === "student" && (
                      <>
                        <div className="space-y-2">
                          <Label>Профилна снимка</Label>
                          <FileDropzone
                            onFileSelect={(files) => {
                              if (files && files.length > 0) {
                                const url = URL.createObjectURL(files[0])
                                updateUserProfile({ profilePicture: url })
                              }
                            }}
                            acceptedFileTypes={["image/jpeg", "image/png"]}
                            label="Качете профилна снимка"
                            className="mt-2"
                            currentFile={user.profilePicture}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="classSection">Паралелка</Label>
                          <Select
                            value={formData.classSection}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, classSection: value }))}
                          >
                            <SelectTrigger id="classSection">
                              <SelectValue placeholder="Изберете паралелка">
                                {formData.classSection ? `11 ${formData.classSection}` : "Изберете паралелка"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="А">11 А</SelectItem>
                              <SelectItem value="Б">11 Б</SelectItem>
                              <SelectItem value="В">11 В</SelectItem>
                              <SelectItem value="Г">11 Г</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">Вашата паралелка в 11 клас.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="technologies">Технологии, които ви интересуват</Label>
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
                          {selectedTechnologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedTechnologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {selectedTechnologies.length === 0 && (
                            <p className="text-sm text-destructive mt-2">Моля, изберете поне една технология.</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub профил (опционално)</Label>
                          <Input
                            id="github"
                            name="github"
                            placeholder="https://github.com/username"
                            value={formData.github}
                            onChange={handleInputChange}
                          />
                          <p className="text-sm text-muted-foreground">Вашият GitHub профил URL.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn профил (опционално)</Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                          />
                          <p className="text-sm text-muted-foreground">Вашият LinkedIn профил URL.</p>
                        </div>
                      </>
                    )}

                    <Button type="submit" disabled={isProfileSubmitting}>
                      {isProfileSubmitting ? "Запазване..." : "Запази промените"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Промяна на парола</CardTitle>
                  <CardDescription>Променете вашата парола.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onPasswordSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текуща парола</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        placeholder="••••••"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Нова парола</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="••••••"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <p className="text-sm text-muted-foreground">Паролата трябва да бъде поне 6 символа.</p>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Потвърди нова парола</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <Button type="submit" disabled={isPasswordSubmitting}>
                      {isPasswordSubmitting ? "Промяна..." : "Промени паролата"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            {user.role === "company" && (
              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle>Информация за компанията</CardTitle>
                    <CardDescription>Управлявайте информацията за вашата компания.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center mb-6">
                        {user.companyLogo ? (
                          <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                            <Image
                              src={user.companyLogo || "/placeholder.svg"}
                              alt={user.companyName || user.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">Няма лого</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Име на компанията</h3>
                          <p className="mt-1">{user.companyName || "Не е зададено"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Уебсайт</h3>
                          <p className="mt-1">
                            {user.companyWebsite ? (
                              <a
                                href={user.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {user.companyWebsite}
                              </a>
                            ) : (
                              "Не е зададен"
                            )}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Адрес</h3>
                          <p className="mt-1">{user.companyAddress || "Не е зададен"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Вид на стажа</h3>
                          <p className="mt-1">
                            {user.internshipType === "online"
                              ? "Онлайн"
                              : user.internshipType === "onsite"
                                ? "Присъствено"
                                : user.internshipType === "hybrid"
                                  ? "Смесено"
                                  : "Не е зададен"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Описание</h3>
                        <p className="mt-1 text-sm">{user.companyDescription || "Няма описание"}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Технологии</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.technologies && user.technologies.length > 0 ? (
                            user.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Няма избрани технологии</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Лице за контакт</h3>
                          <p className="mt-1">{user.contactPerson || "Не е зададено"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Имейл за контакт</h3>
                          <p className="mt-1">{user.contactEmail || user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Телефон за контакт</h3>
                          <p className="mt-1">{user.contactPhone || "Не е зададен"}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Брой места за стажанти</h3>
                        <p className="mt-1">{user.positions || "Не е зададен"}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Изисквани документи</h3>
                        <div className="mt-1">
                          <p>{user.requiresCV ? "✓ CV" : "✗ CV"}</p>
                          <p>{user.requiresMotivationLetter ? "✓ Мотивационно писмо" : "✗ Мотивационно писмо"}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => (window.location.href = "/company/profile-setup")}>
                          Редактирай информацията за компанията
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
