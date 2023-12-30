"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCT_CATEGORIES } from "../config";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

// ActiveIndex decides what to render
const NavItems = () => {
  // passing generic
  const [activeIndex, setActiveIndex] = useState<null | number>();
  const isAnyOpen = activeIndex !== null;

  const navRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    // (e) => handler(e) same thing
    document.addEventListener("keydown", handler);

    // avoid memory leaks
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);
  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null);
          } else {
            setActiveIndex(i);
          }
        };

        const isOpen = i === activeIndex;

        return (
          <NavItem
            category={category}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
