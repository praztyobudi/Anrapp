import { RotateCw } from "lucide-react";

type FullscreenLoaderProps = {
  message?: string;
};

export default function LoadingAnim({
  message = "Loading",
}: FullscreenLoaderProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <p className="flex gap-2 animate-pulse text-gray-500">
          <RotateCw
            size={24}
            strokeWidth={2}
            className="stroke-green-600 animate-spin"
          />
          <span className="dot-anim">{message}</span>
        </p>
      </div>
    </div>
  );
}
