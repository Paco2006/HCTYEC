"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function FormsPage() {
  const forms = [
    {
      id: "1",
      name: "Бланка за избор на компании",
      description: "Формуляр за избор на 5 компании за срещи",
      fileUrl: "/placeholder.svg?height=300&width=200",
      fileType: "PDF",
      updatedAt: "2023-03-15T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Формуляр за мотивационно писмо",
      description: "Шаблон за мотивационно писмо",
      fileUrl: "/placeholder.svg?height=300&width=200",
      fileType: "DOCX",
      updatedAt: "2023-03-16T00:00:00.000Z",
    },
    {
      id: "3",
      name: "Шаблон за CV",
      description: "Шаблон за автобиография (CV)",
      fileUrl: "/placeholder.svg?height=300&width=200",
      fileType: "DOCX",
      updatedAt: "2023-03-17T00:00:00.000Z",
    },
    {
      id: "4",
      name: "Правила за стажа",
      description: "Правила и условия за участие в стажантската програма",
      fileUrl: "/placeholder.svg?height=300&width=200",
      fileType: "PDF",
      updatedAt: "2023-03-18T00:00:00.000Z",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Формуляри и документи</h1>
        <p className="text-muted-foreground">Изтеглете необходимите формуляри и документи за стажантската програма.</p>
      </div>

      <div className="grid gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{form.name}</h3>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                        {form.fileType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Обновен на {new Date(form.updatedAt).toLocaleDateString("bg-BG")}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={form.fileUrl} download={form.name}>
                    <Download className="h-4 w-4 mr-2" />
                    Изтегли
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Инструкции</h2>
        <Card>
          <CardHeader>
            <CardTitle>Как да използвате формулярите</CardTitle>
            <CardDescription>Следвайте тези стъпки, за да попълните и изпратите формулярите правилно.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">1. Бланка за избор на компании</h3>
              <p className="text-sm text-muted-foreground">
                Изтеглете и попълнете бланката с вашите предпочитания за 5 компании, с които искате да проведете срещи.
                Подайте попълнената бланка до крайния срок, посочен в графика на стажантската програма.
              </p>
            </div>
            <div>
              <h3 className="font-medium">2. Формуляр за мотивационно писмо</h3>
              <p className="text-sm text-muted-foreground">
                Използвайте този шаблон, за да напишете вашето мотивационно писмо. Обяснете защо се интересувате от
                конкретната компания и какво ви мотивира да кандидатствате за стаж.
              </p>
            </div>
            <div>
              <h3 className="font-medium">3. Шаблон за CV</h3>
              <p className="text-sm text-muted-foreground">
                Попълнете шаблона за CV с вашата информация, умения и опит. Уверете се, че сте включили всички
                релевантни технически умения и проекти.
              </p>
            </div>
            <div>
              <h3 className="font-medium">4. Правила за стажа</h3>
              <p className="text-sm text-muted-foreground">
                Прочетете внимателно правилата и условията за участие в стажантската програма. Кандидатствайки, вие се
                съгласявате да спазвате тези правила.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
