import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Loader className="h-10 w-10 animate-spin text-white" />
    </div>
  );
}
