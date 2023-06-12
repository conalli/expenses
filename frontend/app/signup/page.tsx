import AuthForm from "@/components/ui/auth-form";
import Link from "next/link";

export default function SignUp() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <AuthForm variant="Sign up" />
      <div className="flex gap-2 py-4 text-muted-foreground">
        <p>Already have an account?</p>
        <Link href="/signin" className="underline">
          Sign in{" "}
        </Link>
      </div>
    </main>
  );
}
