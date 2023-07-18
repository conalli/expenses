import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-6xl text-emerald-600 font-semibold">
        Manage your Expenses.
      </h1>
      <h1 className="text-6xl text-emerald-600 font-semibold pb-4">
        Take control of your life.
      </h1>
      <Image
        src="/home_art/expenses.jpg"
        alt="expenses picture"
        width={900}
        height={600}
      />
      <div className="flex">
        <Link href="/signup" className="font-bold underline text-lg px-2">
          Sign up
        </Link>
        <p className="text-lg">to get started tracking your expenses today.</p>
      </div>
      <p className="text-lg">
        Input your expenses, or just take a picture of your receipts to quickly
        get started.
      </p>
    </main>
  );
}
