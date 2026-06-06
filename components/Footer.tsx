import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f0e0d3]" aria-label="Pied de page">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <h2 className="font-serif text-primary font-semibold text-lg mb-4">Contact</h2>
            <ul className="space-y-3 text-sm text-text-main">
              <li>
                <a
                  href="tel:+32484666892"
                  className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                >
                  <Phone size={15} aria-hidden="true" />
                  0484/66.68.92
                </a>
              </li>
              <li>
                <a
                  href="mailto:julie.budie@icloud.com"
                  className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                >
                  <Mail size={15} aria-hidden="true" />
                  julie.budie@icloud.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-text-main/70">
                <MapPin size={15} aria-hidden="true" className="shrink-0" />
                Seneffe, Belgique
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-primary font-semibold text-lg mb-4">Zone d&apos;intervention</h2>
            <ul className="text-sm text-text-main/80 space-y-1.5 columns-2" role="list">
              {["Seneffe", "Feluy", "Familleureux", "Arquennes", "Manage", "Nivelles", "Pont-à-Celles", "Ecaussinnes"].map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-primary font-semibold text-lg mb-4">Informations</h2>
            <ul className="space-y-2 text-sm" role="list">
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "CGV",              href: "/cgv"              },
                { label: "Contact",          href: "/contact"          },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-text-main hover:text-primary transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 py-5">
        <p className="text-center text-xs text-text-main/50">
          © {new Date().getFullYear()} Julie Coiff. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
