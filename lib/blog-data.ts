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
    content: `
  <div class="space-y-6 text-gray-700 leading-relaxed">
    <p class="text-lg font-medium text-gray-900">Si vous suivez un peu les tendances capillaires, vous n'avez pas pu passer à côté. Le "Expensive Blonde" (ou blond luxueux) est sur toutes les têtes cette année. Mais qu'est-ce qui rend ce balayage si spécial, et pourquoi est-il la demande numéro un de mes clientes dans la région de Seneffe ?</p>

    <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">1. Fini le blond polaire, place à la dimension</h2>
    <p>Pendant des années, la tendance était au blond le plus blanc et froid possible. Le problème ? C'est une couleur extrêmement difficile à entretenir et qui a tendance à fragiliser la fibre capillaire. Le <strong>Expensive Blonde</strong> prend le contre-pied total : c'est un balayage qui joue sur la chaleur, le contraste et les nuances.</p>
    <p>En mélangeant des tons dorés, miel, sable et beige, on crée une couleur sur-mesure qui accroche la lumière de manière spectaculaire. Le résultat fait beaucoup plus naturel, plus sain, et surtout, beaucoup plus élégant.</p>

    <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">2. Un entretien beaucoup plus doux</h2>
    <p>C'est l'argument principal qui séduit mes clientes. Parce que le "Expensive Blonde" garde une racine fondue (le fameux <em>shadow root</em>) et des nuances proches de votre base naturelle, la repousse est ultra-douce. Fini l'effet "barre" au bout de trois semaines !</p>
    <p>Vous pouvez espacer vos rendez-vous de balayage tous les 3 à 4 mois, en prévoyant simplement un petit soin gloss entre les deux pour raviver la brillance.</p>

    <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">3. Le secret de la réussite : le temps et le diagnostic</h2>
    <p>Créer ces multiples dimensions demande une vraie technique d'orfèvre et du temps. C'est là que le format <strong>coiffure à domicile</strong> prend tout son sens.</p>
    <p>Lorsque je me déplace chez vous, que ce soit à Seneffe, Manage ou dans les communes alentours, je vous dédie 100 % de mon attention. Pas de stress, pas de téléphone qui sonne au salon, pas d'attente au bac. Nous prenons le temps de faire un vrai diagnostic pour choisir les nuances qui mettront parfaitement en valeur votre teint et la couleur de vos yeux.</p>

    <div class="bg-orange-50 p-6 rounded-xl mt-8 border border-orange-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Mon conseil de Pro pour notre région :</h3>
      <p class="text-sm">L'eau de notre région pouvant parfois ternir les reflets chauds, je recommande toujours à mes clientes d'utiliser un shampoing doux sans sulfates et de faire un soin hydratant profond une fois par semaine. Un cheveu bien hydraté est un cheveu qui garde sa lumière !</p>
    </div>
  </div>
`,
    date: "2026-06-08",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop",
  },
];
