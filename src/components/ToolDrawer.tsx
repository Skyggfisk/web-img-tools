import type { ActiveTool } from "~/types/types";

interface ToolDrawerProps {
  children: React.ReactNode;
  toolDrawerOpen: boolean;
  setToolDrawerOpen: (open: boolean) => void;
  activeSection: ActiveTool;
}

export function ToolDrawer({
  children,
  toolDrawerOpen,
  setToolDrawerOpen,
  activeSection,
}: ToolDrawerProps) {
  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 h-max max-h-96 w-max bg-gray-700 shadow-2xl rounded-t-lg transform transition-transform duration-300 ease-in-out z-40 ${
        toolDrawerOpen ? "translate-y-0" : "translate-y-[calc(100%-3rem)]"
      }`}
    >
      <div
        onClick={() => setToolDrawerOpen(!toolDrawerOpen)}
        className="px-6 py-3 rounded-t-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center justify-center gap-3 shadow-lg"
      >
        <span className="font-medium">
          {activeSection === "info" && "Image Info"}
          {activeSection === "palette" && "Color Palette"}
          {activeSection === "optimization" && "Optimization"}
          {activeSection === "filters" && "Filters & Edit"}
          {activeSection === "transform" && "Transform"}
        </span>
        <span
          className={`transform transition-transform duration-200 ${
            toolDrawerOpen ? "rotate-180" : ""
          }`}
        >
          ▲
        </span>
      </div>

      <div className="p-6 h-full overflow-y-auto">{children}</div>
    </div>
  );
}
