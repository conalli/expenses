import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-6xl text-emerald-600 font-semibold">
        Manage your Expenses.
      </h1>
      <h1 className="text-6xl text-emerald-600 font-semibold pb-4">
        Manage your life.
      </h1>
      <Image
        src="/home_art/expenses.jpg"
        alt="expenses picture"
        width={900}
        height={600}
      />
      <p className="text-lg">
        Sign up to get started tracking your expenses today.
      </p>
      <p className="text-lg">
        Input your expenses, or just take a picture of your receipts to quickly
        get started.
      </p>
    </main>
  );
}
