"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpen(true);
  };
  const handleMouseLeave = () => setSubmenuOpen(false);

  // If item has submenu we render a button that toggles submenu (so clicking "Movies" opens menu instead of navigating)
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.submenu ? (
        <button
          onClick={() => setSubmenuOpen((s) => !s)}
          className={`text-lg flex items-center gap-2 hover:text-black capitalized ${
            path === item.href ? 'text-black/75' : 'text-black/75'
          }`}
          aria-haspopup="true"
          aria-expanded={submenuOpen}
        >
          <span>{item.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
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
          className={`text-lg flex hover:text-black capitalized  ${
            path === item.href ? 'text-black/75 ' : ' text-black/75 '
          }`}
        >
          {item.label}
        </Link>
      )}

      {submenuOpen && item.submenu && (
        <div
          className={`absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg z-50`}
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block px-4 py-2 ${
                path === subItem.href ? 'text-white' : 'text-black dark:text-white hover:bg-primary'
              }`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
