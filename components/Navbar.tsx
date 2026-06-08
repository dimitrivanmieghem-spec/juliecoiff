"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/",           label: "Accueil"   },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#avis",      label: "Avis"      },
  { href: "/blog",       label: "Conseils"  },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-background-cream/90 backdrop-blur-sm border-b border-primary/10">
      <nav
        className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center md:justify-between"
        aria-label="Navigation principale"
      >
        <Link href="/" aria-label="Retour à l'accueil">
          <Image
            src="/logo.png"
            alt="Julie Coiff"
            width={150}
            height={60}
            quality={75}
            priority
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-text-main hover:text-primary transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#booking"
          className="hidden md:inline-block bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
        >
          Prendre rendez-vous
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
