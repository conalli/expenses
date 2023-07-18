import { Loader } from "@/components/ui/loading/Loader";

export default function Loading() {
  return (
    <main className="w-full h-[80vh]">
      <div className="grid grid-cols-10">
        <div className="col-start-1 col-span-2 row-span-2 px-8 py-4 flex flex-col gap-4 h-[calc(100vh-80px)] bg-stone-100"></div>
        <div className="col-start-3 col-span-7 flex items-center justify-center w-full h-[80vh]">
          <Loader color="text-emerald-600" />
        </div>
      </div>
    </main>
  );
}
