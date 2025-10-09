interface SidebarMenuProps {
  menuName: string;
  isActiveSection: boolean;
  handleSectionClick: () => void;
}

export function SidebarMenu({
  menuName,
  isActiveSection,
  handleSectionClick,
}: SidebarMenuProps) {
  return (
    <button
      onClick={handleSectionClick}
      className={`w-full text-left px-4 py-2 rounded-md transition-colors cursor-pointer ${
        isActiveSection ? "bg-cyan-600" : "hover:bg-neutral-500"
      }`}
    >
      {menuName}
    </button>
  );
}
