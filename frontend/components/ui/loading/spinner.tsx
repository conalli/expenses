export function Spinner({
  color,
  containerStyles,
  spinnerStyles,
}: {
  color?: string;
  containerStyles?: string;
  spinnerStyles?: string;
}) {
  let spinnerColor = color ?? "text-blue-600";
  let container = containerStyles ?? "";
  let spinner = spinnerStyles ?? "";
  return (
    <div className={"flex justify-center items-center " + container}>
      <div
        className={
          "animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full selection:" +
          spinnerColor +
          " " +
          spinner
        }
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
