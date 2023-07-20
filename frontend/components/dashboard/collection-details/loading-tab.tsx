import { Spinner } from "@/components/ui/loading/spinner";

export default function LoadingTab() {
  return (
    <div className="w-[20vw] h-[20vw] flex justify-center items-center m-auto">
      <Spinner />
    </div>
  );
}
