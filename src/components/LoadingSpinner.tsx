import { useEffect, useState } from "react";

export function LoadingSpinner({
  message = "Loading...",
}: {
  message?: string;
}) {
  const [progress, setProgress] = useState(0);

  // Optional: Simulate progress for better UX (e.g., based on image load)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Cap at 90% until done
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Spinning animation */}
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>

        {/* Progress bar */}
        <div className="w-64 bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-white text-lg">{message}</p>
        <p className="text-gray-400 text-sm mt-2">
          This may take a moment on slower connections...
        </p>
      </div>
    </div>
  );
}
