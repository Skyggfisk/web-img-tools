import type { ActiveTool } from "~/types/types";
import { SidebarMenu } from "./SidebarMenu";

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
            <SidebarMenu
              menuName="Image Information"
              isActiveSection={activeSection === "info"}
              handleSectionClick={() => handleSectionClick("info")}
            />
            <SidebarMenu
              menuName="Color Palette"
              isActiveSection={activeSection === "palette"}
              handleSectionClick={() => handleSectionClick("palette")}
            />
            <SidebarMenu
              menuName="Filters & Edit"
              isActiveSection={activeSection === "filters"}
              handleSectionClick={() => handleSectionClick("filters")}
            />
            <SidebarMenu
              menuName="Optimization"
              isActiveSection={activeSection === "optimization"}
              handleSectionClick={() => handleSectionClick("optimization")}
            />
            <SidebarMenu
              menuName="Transform"
              isActiveSection={activeSection === "transform"}
              handleSectionClick={() => handleSectionClick("transform")}
            />
          </nav>
        </div>
      </div>
    </>
  );
}
