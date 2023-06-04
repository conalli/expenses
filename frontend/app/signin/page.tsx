import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function SignIn() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <AuthForm variant="Sign in" />
      <div className="flex gap-2 py-4 text-muted-foreground">
        <p>Don&apos;t have an account yet?</p>
        <Link href="/signup" className="underline">
          Sign up{" "}
        </Link>
      </div>
    </main>
  );
}
