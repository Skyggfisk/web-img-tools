interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BurgerMenu({ isOpen, onToggle }: BurgerMenuProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 z-60 p-2 rounded-md shadow-md cursor-pointer transition-all duration-300 ${
        isOpen
          ? "left-50 shadow-none hover:bg-neutral-500"
          : "left-4 bg-white hover:bg-gray-50"
      }`}
      aria-label="Toggle menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block w-5 h-0.5 transition-all duration-300 ${
            isOpen
              ? "bg-white rotate-45 translate-y-0.5"
              : "bg-gray-600 -translate-y-1"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 transition-all duration-300 ${
            isOpen ? "bg-white opacity-0" : "bg-gray-600 opacity-100"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 transition-all duration-300 ${
            isOpen
              ? "bg-white -rotate-45 -translate-y-0.5"
              : "bg-gray-600 translate-y-1"
          }`}
        ></span>
      </div>
    </button>
  );
}
