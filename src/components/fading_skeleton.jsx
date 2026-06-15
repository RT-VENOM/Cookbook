import { Skeleton as Skeleton_ui } from "@/components/ui/skeleton";

export default function Skeleton({ isLoading }) {
  return (
    <div
      className={`absolute inset-0 z-10 bg-background transition-opacity duration-700 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Skeleton_ui className="h-full w-full" />
    </div>
  );
}
