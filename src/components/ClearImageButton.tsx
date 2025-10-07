export function ClearImageButton({ clearImage }: { clearImage: () => void }) {
  return (
    <button
      onClick={clearImage}
      className="fixed top-4 left-16 z-50 w-10 h-10 p-2 bg-rose-800 text-white font-bold rounded-md flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer"
      title="Clear image"
    >
      ✕
    </button>
  );
}
