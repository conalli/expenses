"use client";

import { useForm } from "react-hook-form";
import { AuthRequest, AuthResponse } from "./Auth";

export default function LogInForm() {
  const { register, handleSubmit, formState, reset } = useForm<AuthRequest>();
  const handleLogIn = async (data: AuthRequest): Promise<void> => {
    try {
      const response = await fetch("/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        const res = (await response.json()) as AuthResponse;
        await window.localStorage.setItem("EXPENSES_USER", JSON.stringify(res));
        window.location.assign("/dashboard");
      }
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogIn)} className="text-black">
      <input type="text" placeholder="username" {...register("username")} />
      <input type="email" placeholder="email" {...register("email")} />
      <input type="password" placeholder="password" {...register("password")} />
      <button type="submit" className="bg-blue-500">
        Log In
      </button>
    </form>
  );
}
