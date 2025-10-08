import type { ActiveTool } from "~/types/types";

interface SidebarProps {
  isOpen: boolean;
  activeSection: ActiveTool;
  onSectionChange: (section: ActiveTool) => void;
  onClose: () => void;
}

export function Sidebar({
  isOpen,
  activeSection,
  onSectionChange,
  onClose,
}: SidebarProps) {
  const handleSectionClick = (section: ActiveTool) => {
    onSectionChange(section);
    onClose();
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-600 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Menu</h2>
          <div className="border-b border-neutral-500 mb-4"></div>
          <nav className="space-y-2">
            <button
              onClick={() => handleSectionClick("info")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-white ${
                activeSection === "info"
                  ? "bg-blue-600"
                  : "hover:bg-neutral-500 cursor-pointer"
              }`}
            >
              Image Information
            </button>
            <button
              onClick={() => handleSectionClick("palette")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-white ${
                activeSection === "palette"
                  ? "bg-blue-600"
                  : "hover:bg-neutral-500 cursor-pointer"
              }`}
            >
              Color Palette
            </button>
            <button
              onClick={() => handleSectionClick("optimization")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-white ${
                activeSection === "optimization"
                  ? "bg-blue-600"
                  : "hover:bg-neutral-500 cursor-pointer"
              }`}
            >
              Optimization
            </button>
            <button
              onClick={() => handleSectionClick("filters")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-white ${
                activeSection === "filters"
                  ? "bg-blue-600"
                  : "hover:bg-neutral-500 cursor-pointer"
              }`}
            >
              Filters & Edit
            </button>
            <button
              onClick={() => handleSectionClick("transform")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-white ${
                activeSection === "transform"
                  ? "bg-blue-600"
                  : "hover:bg-neutral-500 cursor-pointer"
              }`}
            >
              Transform
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
