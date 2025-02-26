import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function LoadingPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="mt-4 h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}

export function LoadingButton({ children, className }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LoadingSpinner className="h-4 w-4" />
      {children}
    </div>
  );
}
