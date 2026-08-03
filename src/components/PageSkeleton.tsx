import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = ({ label }: { label?: string }) => (
  <div className="min-h-screen flex flex-col">
    <div className="h-16 border-b flex items-center px-4 gap-3">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-4 w-32" />
      <div className="ml-auto flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-10 space-y-6">
      {label && <Skeleton className="h-4 w-48" />}
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
