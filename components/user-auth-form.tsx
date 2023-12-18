"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  showAdditionalFields?: boolean;
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, showAdditionalFields = true, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema)
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (!showAdditionalFields) {
      setValue("email", "none@example.com");
      setValue("phone_number", "000000000");
    }
  }, [showAdditionalFields, setValue]);

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    if (showAdditionalFields) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        response
      })
    }

    const signInResult = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: true,
      callbackUrl: searchParams?.get("from") || "/dashboard",
    })

    setIsLoading(false)

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("username")}
            />
          </div>
          {showAdditionalFields && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading || isGitHubLoading}
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="phone_number">
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  placeholder="xxx xx xx xx"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading || isGitHubLoading}
                  {...register("phone_number")}
                />
              </div>
            </>
          )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
            />
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
