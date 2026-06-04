"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",           label: "Accueil"   },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#avis",      label: "Avis"      },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background-cream/90 backdrop-blur-sm border-b border-primary/10">
      <nav
        className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Navigation principale"
      >
        <Link href="/" aria-label="Retour à l'accueil">
          <Image
            src="/logo.png"
            alt="Julie Coiff"
            width={150}
            height={60}
            className="h-12 w-auto object-contain cursor-pointer"
            priority={true}
          />
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-3">
          <Link
            href="/#booking"
            className="hidden md:inline-block bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
            aria-label="Prendre rendez-vous"
          >
            Prendre rendez-vous
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-text-main hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out z-50 bg-background-cream/98 backdrop-blur-sm border-b border-primary/10 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-4 gap-1" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-3 text-base text-text-main hover:text-primary hover:bg-primary/5 rounded-xl transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-3 border-t border-primary/10 mt-2">
            <Link
              href="/#booking"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-primary hover:bg-primary-light text-white font-medium text-sm px-4 py-3 rounded-full transition-colors duration-200"
            >
              Prendre rendez-vous
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
