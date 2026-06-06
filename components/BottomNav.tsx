"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Images, Calendar, Phone } from "lucide-react";

const navItems = [
  { href: "/",                label: "Accueil",     icon: Home     },
  { href: "/#portfolio",      label: "Galerie",     icon: Images   },
  { href: "/#booking",        label: "Réservation", icon: Calendar },
  { href: "tel:+32484666892", label: "Contact",     icon: Phone    },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  function isActive(href: string) {
    if (href.startsWith("tel:") || href.includes("#")) return false;
    return pathname === href;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-cream/95 backdrop-blur-sm border-t border-primary/15"
      aria-label="Navigation mobile"
    >
      <ul className="flex h-14" role="list">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1 relative flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center w-full gap-0.5 transition-colors ${
                  active ? "text-primary" : "text-text-main/45 hover:text-primary active:text-primary"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
              {active && (
                <span
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
