export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
}

export const articles: Article[] = [
  {
    slug: "tendance-expensive-blonde-balayage",
    title: "Le 'Expensive Blonde' : Pourquoi c'est le balayage incontournable cette année ?",
    excerpt: "Oubliez les blonds froids et difficiles à entretenir. Découvrez pourquoi le balayage nuancé et lumineux est la coloration que toutes les femmes demandent à Seneffe et ses alentours.",
    content: "<p>Contenu temporaire de l'article SEO...</p>",
    date: "2026-06-08",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop",
  },
];
