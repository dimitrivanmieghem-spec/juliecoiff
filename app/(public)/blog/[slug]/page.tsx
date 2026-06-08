import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft } from "lucide-react";
import { articles } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} | Julie Coiff`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const dateFormatted = new Date(article.date).toLocaleDateString("fr-BE", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4 mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au journal
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs text-text-main/40 mb-4">
          <Clock className="w-3.5 h-3.5" />
          {article.readTime}
          <span className="mx-1">·</span>
          <time dateTime={article.date}>{dateFormatted}</time>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-text-main font-semibold leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-base text-text-main/60 leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <div className="flex items-center space-x-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-100"
          />
          <div>
            <p className="text-sm font-medium text-text-main">{article.author.name}</p>
            <p className="text-sm text-gray-500">{article.author.role}</p>
          </div>
        </div>
      </header>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-md mb-10">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
      </div>

      <div
        className="prose prose-stone max-w-none text-text-main/80 leading-relaxed text-[15px] [&_p]:mb-5 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-text-main [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-text-main"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-16 bg-gradient-to-br from-primary/10 via-[#f5e0d5] to-primary/5 border border-primary/15 rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
          Passez à l&apos;action
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-text-main font-semibold leading-tight mb-4">
          Envie d&apos;un diagnostic personnalisé ?
        </h2>
        <p className="text-sm text-text-main/60 max-w-md mx-auto leading-relaxed mb-6">
          Julie se déplace chez vous avec tout son matériel professionnel. Réservez votre moment coiffure en quelques clics.
        </p>
        <Link
          href="/#booking"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          Réservez votre moment coiffure
        </Link>
      </div>
    </div>
  );
}
