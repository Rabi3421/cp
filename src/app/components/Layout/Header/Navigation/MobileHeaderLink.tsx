import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const submenuRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!submenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubmenuOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [submenuOpen])

  const handleToggle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setSubmenuOpen(!submenuOpen);
    if (!submenuOpen) setTimeout(() => submenuRefs.current[0]?.focus(), 0);
  };

  return (
    <div className="relative w-full">
      {item.submenu ? (
        <button
          ref={buttonRef}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSubmenuOpen(true);
              setTimeout(() => submenuRefs.current[0]?.focus(), 0);
            }
            if (e.key === 'Escape') {
              setSubmenuOpen(false);
            }
          }}
          className="flex items-center justify-between w-full py-2 text-white text-muted focus:outline-hidden"
          aria-expanded={submenuOpen}
        >
          {item.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
            className={`${submenuOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        </button>
      ) : (
        <Link
          href={item.href}
          className="flex items-center justify-between w-full py-2 text-white text-muted focus:outline-hidden"
        >
          {item.label}
        </Link>
      )}

      {submenuOpen && item.submenu && (
        <div className="bg-white p-2 w-full">
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              ref={(el: HTMLAnchorElement) => (submenuRefs.current[index] = el)}
              className="block py-2 text-gray-500 hover:bg-gray-200"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
