import AuthForm from "@/components/auth/AuthForm";

export default function SignUp() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <AuthForm variant="Sign up" />
    </main>
  );
}
