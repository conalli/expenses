"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthResponse } from "@/lib/api/response";
import { apiURL } from "@/lib/api/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../use-toast";

type AuthFormVariant = "Sign in" | "Sign up";

export type AuthRequest = {
  username: string;
  email: string;
  password: string;
};

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50),
  email: z.string().email({
    message: "Must be a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(50),
});

export default function AuthForm({ variant }: { variant: AuthFormVariant }) {
  const form = useForm<AuthRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSignUpSubmit = async (values: AuthRequest) => {
    try {
      const response = await fetch(apiURL("/signup/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.status === 200) {
        router.push("/signin");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "please check your credentials and try again",
      });
      form.reset();
    }
  };

  const onSignInSubmit = async (values: AuthRequest) => {
    try {
      const response = await fetch(apiURL("/token/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.status === 200) {
        const res = (await response.json()) as AuthResponse;
        await window.sessionStorage.setItem(
          "EXPENSES_USER",
          JSON.stringify(res)
        );
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "please check your credentials and try again",
      });
      form.reset();
    }
  };

  const onSubmit = variant === "Sign in" ? onSignInSubmit : onSignUpSubmit;

  return (
    <div>
      <h1 className="font-bold text-2xl py-8">{variant}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" {...field} />
                </FormControl>
                <FormDescription>Your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Your password (must be over 6 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{variant}</Button>
        </form>
      </Form>
    </div>
  );
}
