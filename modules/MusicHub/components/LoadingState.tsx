import { AppLayout } from "@/modules/AppLayout";

export const LoadingState = () => (
  <AppLayout>
    <div className="max-w-6xl mx-auto px-4 py-8 text-center">
      <div className="animate-pulse text-gray-400">Loading your library...</div>
    </div>
  </AppLayout>
);