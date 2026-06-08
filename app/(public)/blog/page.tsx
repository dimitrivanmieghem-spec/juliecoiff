import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { articles } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Conseils Coiffure & Actus | Julie Coiff",
  description:
    "Découvrez les conseils d'experte de Julie, votre coiffeuse à domicile dans la région de Seneffe, Manage et Nivelles.",
};

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
          Blog
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-text-main font-semibold leading-tight">
          Le Journal de Julie
        </h1>
        <p className="mt-4 text-base text-text-main/60 max-w-xl mx-auto leading-relaxed">
          Tendances, conseils d&apos;experte et inspirations coiffure — directement depuis votre coiffeuse à domicile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group flex flex-col bg-white/80 border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-1.5 text-xs text-text-main/40 mb-3">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
                <span className="mx-1">·</span>
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("fr-BE", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </time>
              </div>

              <h2 className="font-serif text-lg font-semibold text-text-main leading-snug mb-3 group-hover:text-primary transition-colors duration-200">
                {article.title}
              </h2>

              <p className="text-sm text-text-main/60 leading-relaxed flex-1">
                {article.excerpt}
              </p>

              <span className="mt-5 text-sm font-medium text-primary group-hover:underline underline-offset-4">
                Lire l&apos;article →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
