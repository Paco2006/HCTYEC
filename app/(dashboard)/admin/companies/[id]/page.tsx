"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockCompanies, mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDropzone } from "@/components/file-dropzone"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { ExternalLink, MapPin, Globe, Users, FileText, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Company, User } from "@/lib/types"

export default function AdminCompanyDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [companyUsers, setCompanyUsers] = useState<User[]>([])
  const [newUserEmail, setNewUserEmail] = useState("")

  useEffect(() => {
    // Find company by ID
    const foundCompany = mockCompanies.find((c) => c.id === id)
    if (foundCompany) {
      setCompany(foundCompany)
      // Find users associated with this company
      setCompanyUsers(foundCompany.users)
    }
  }, [id])

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Достъпът е отказан</h2>
          <p className="text-muted-foreground mt-2">Нямате права за достъп до тази страница.</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Компанията не е намерена</h2>
          <p className="text-muted-foreground mt-2">Компанията, която търсите, не съществува или е премахната.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/companies">Обратно към компании</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSaveChanges = () => {
    toast({
      title: "Промените са запазени",
      description: "Информацията за компанията беше успешно обновена.",
    })
    setIsEditing(false)
  }

  const handleAddUser = () => {
    if (!newUserEmail) {
      toast({
        title: "Грешка",
        description: "Моля, въведете имейл адрес.",
        variant: "destructive",
      })
      return
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === newUserEmail)
    if (existingUser) {
      // Add user to company
      if (!companyUsers.some((u) => u.id === existingUser.id)) {
        setCompanyUsers([...companyUsers, existingUser])
        toast({
          title: "Потребителят е добавен",
          description: `${existingUser.name} беше успешно добавен към компанията.`,
        })
        setNewUserEmail("")
      } else {
        toast({
          title: "Грешка",
          description: "Този потребител вече е добавен към компанията.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Грешка",
        description: "Не е намерен потребител с този имейл адрес.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveUser = (userId: string) => {
    setCompanyUsers(companyUsers.filter((u) => u.id !== userId))
    toast({
      title: "Потребителят е премахнат",
      description: "Потребителят беше успешно премахнат от компанията.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground">Управление на информацията за компанията.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/companies">Обратно към списъка</Link>
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Редактирай</Button>
          ) : (
            <Button onClick={handleSaveChanges}>Запази промените</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">
            Детайли
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1">
            Потребители
          </TabsTrigger>
          <TabsTrigger value="internship" className="flex-1">
            Стаж
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Информация за компанията</CardTitle>
              <CardDescription>Преглед и редактиране на основната информация за компанията.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <Label>Лого</Label>
                    <div className="relative h-40 w-full bg-muted rounded-lg overflow-hidden mt-2">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    {isEditing && (
                      <div className="mt-2">
                        <FileDropzone
                          onFileUpload={() => {}}
                          acceptedFileTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                          label="Качете лого"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <Label htmlFor="name">Име на компанията</Label>
                      {isEditing ? (
                        <Input id="name" defaultValue={company.name} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-lg">{company.name}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Описание</Label>
                      {isEditing ? (
                        <Textarea id="description" defaultValue={company.description} className="mt-1 min-h-[100px]" />
                      ) : (
                        <div className="mt-1 text-muted-foreground">{company.description}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    {isEditing ? (
                      <Input id="address" defaultValue={company.address} className="mt-1" />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{company.address}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Уебсайт</Label>
                    {isEditing ? (
                      <Input id="website" defaultValue={company.website} className="mt-1" />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="technologies">Технологии</Label>
                  {isEditing ? (
                    <Input
                      id="technologies"
                      defaultValue={company.technologies.join(", ")}
                      className="mt-1"
                      placeholder="JavaScript, React, Node.js"
                    />
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {company.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Потребители</CardTitle>
              <CardDescription>Управление на потребителите, свързани с тази компания.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="newUserEmail">Добави потребител</Label>
                    <Input
                      id="newUserEmail"
                      placeholder="Имейл адрес"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleAddUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добави
                  </Button>
                </div>

                <div className="space-y-4">
                  {companyUsers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Няма потребители, свързани с тази компания.
                    </div>
                  ) : (
                    companyUsers.map((companyUser) => (
                      <div key={companyUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(companyUser.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{companyUser.name}</div>
                            <div className="text-sm text-muted-foreground">{companyUser.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUser(companyUser.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Премахни
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internship">
          <Card>
            <CardHeader>
              <CardTitle>Информация за стажа</CardTitle>
              <CardDescription>Преглед и редактиране на информацията за стажантската програма.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="internshipDescription">Описание на стажа</Label>
                  {isEditing ? (
                    <Textarea
                      id="internshipDescription"
                      defaultValue={company.internshipDescription}
                      className="mt-1 min-h-[100px]"
                    />
                  ) : (
                    <div className="mt-1 text-muted-foreground">{company.internshipDescription}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="internshipPositions">Брой места</Label>
                    {isEditing ? (
                      <Input
                        id="internshipPositions"
                        type="number"
                        min="1"
                        defaultValue={company.internshipPositions}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.internshipPositions} места за стажанти</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="requiresMotivationLetter">Изисква мотивационно писмо</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox id="requiresMotivationLetter" defaultChecked={company.requiresMotivationLetter} />
                        <Label htmlFor="requiresMotivationLetter" className="font-normal">
                          Изисква мотивационно писмо
                        </Label>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {company.requiresMotivationLetter
                            ? "Изисква се мотивационно писмо"
                            : "Не се изисква мотивационно писмо"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="internshipRequirements">Изисквания за стажа</Label>
                  {isEditing ? (
                    <Textarea
                      id="internshipRequirements"
                      defaultValue={company.internshipRequirements}
                      className="mt-1 min-h-[100px]"
                    />
                  ) : (
                    <div className="mt-1 text-muted-foreground">{company.internshipRequirements}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Презентация</Label>
                    {company.presentationUrl ? (
                      <div className="mt-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={company.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Презентация
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="mt-1 text-muted-foreground">Няма качена презентация</div>
                    )}
                    {isEditing && (
                      <div className="mt-2">
                        <FileDropzone
                          onFileUpload={() => {}}
                          acceptedFileTypes={[
                            "application/pdf",
                            "application/vnd.ms-powerpoint",
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                          ]}
                          label="Качете презентация"
                          currentFile={company.presentationUrl}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>План на стажа</Label>
                    {company.planUrl ? (
                      <div className="mt-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={company.planUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          План на стажа
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="mt-1 text-muted-foreground">Няма качен план</div>
                    )}
                    {isEditing && (
                      <div className="mt-2">
                        <FileDropzone
                          onFileUpload={() => {}}
                          acceptedFileTypes={[
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ]}
                          label="Качете план на стажа"
                          currentFile={company.planUrl}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
