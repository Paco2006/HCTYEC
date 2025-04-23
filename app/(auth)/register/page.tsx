"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Името трябва да бъде поне 2 символа.",
    }),
    email: z.string().email({
      message: "Моля, въведете валиден имейл адрес.",
    }),
    password: z.string().min(6, {
      message: "Паролата трябва да бъде поне 6 символа.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролите не съвпадат",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      await register(values.email, values.password, values.name)
      toast({
        title: "Регистрацията е успешна",
        description: "Вече можете да влезете в системата.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Грешка при регистрация",
        description: "Възникна проблем при създаването на акаунта.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight">NSTUES</h1>
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight">Регистрация</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Име и фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имейл адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="example@elsys-bg.org" {...field} />
                    </FormControl>
                    <FormDescription>
                      За ученици: използвайте училищния имейл (име.s.фамилия.година@elsys-bg.org)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Парола</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Потвърди парола</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Регистрация"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Вече имате акаунт?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                Вход
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
