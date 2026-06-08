export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  author: { name: string; role: string; avatar: string };
}

export const articles: Article[] = [
  {
    slug: "3-erreurs-douche-cheveux",
    title: "3 erreurs toutes simples que l'on fait sous la douche (et qui abîment les cheveux)",
    excerpt: "Pas besoin de routines compliquées. Découvrez ces 3 petites habitudes à changer dès votre prochain shampoing pour retrouver des cheveux en pleine santé !",
    date: "2026-06-08",
    readTime: "2 min",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    author: { name: "Julie", role: "Votre coiffeuse à domicile", avatar: "/images/julie-avatar.jpg" },
    content: `
      <div class="space-y-6 text-gray-700 leading-relaxed">
        <p class="text-lg font-medium text-gray-900">On rêve toutes d'avoir des cheveux brillants, mais le quotidien va vite. Plutôt que de vous proposer des routines interminables, voici 3 erreurs très fréquentes que je remarque au quotidien... et comment les corriger facilement !</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">1. Laver les longueurs au lieu du cuir chevelu</h2>
        <p>C'est un réflexe courant : prendre une grosse noisette de shampoing et frotter vigoureusement les longueurs. <strong>C'est une erreur !</strong> Le rôle du shampoing est de nettoyer le cuir chevelu. Massez doucement vos racines. Au moment du rinçage, la mousse coulera sur vos longueurs, ce qui sera largement suffisant pour les nettoyer sans les assécher.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">2. Utiliser une eau trop chaude</h2>
        <p>L'eau très chaude ouvre brutalement les écailles du cheveu, ce qui le rend poreux et terne. L'astuce simple ? Lavez vos cheveux à l'eau tiède, et si vous en avez le courage, terminez par un jet d'eau fraîche. Vos écailles vont se refermer et capteront beaucoup mieux la lumière.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">3. Essorer ses cheveux comme une serviette de bain</h2>
        <p>Le cheveu mouillé est extrêmement fragile. En le frottant énergiquement avec une serviette, vous le cassez. Prenez plutôt l'habitude d'envelopper vos cheveux et de <strong>tapoter doucement</strong> pour absorber l'humidité.</p>

        <div class="bg-orange-50 p-6 rounded-xl mt-8 border border-orange-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">L'astuce de Julie :</h3>
          <p class="text-sm">La beauté de vos cheveux commence par les bons gestes à la maison. Lors de mon prochain passage chez vous, montrez-moi vos produits, nous ferons le tri ensemble pour garder l'essentiel !</p>
        </div>
      </div>
    `,
  },
  {
    slug: "cheveux-gras-espacer-shampoings",
    title: "Cheveux qui regraissent vite : la technique pour enfin espacer ses shampoings",
    excerpt: "Vous avez l'impression de devoir laver vos cheveux tous les jours ? Voici la méthode infaillible pour briser ce cercle vicieux en douceur.",
    date: "2026-06-05",
    readTime: "2 min",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
    author: { name: "Julie", role: "Votre coiffeuse à domicile", avatar: "/images/julie-avatar.jpg" },
    content: `
      <div class="space-y-6 text-gray-700 leading-relaxed">
        <p class="text-lg font-medium text-gray-900">C'est l'un des problèmes les plus fréquents de mes clientes. Plus on lave ses cheveux, plus ils regraissent vite. C'est un mécanisme de défense naturel du cuir chevelu. Voici comment inverser la tendance.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">1. La règle de la transition douce</h2>
        <p>Ne passez pas d'un shampoing quotidien à un shampoing par semaine du jour au lendemain. Commencez par décaler d'une seule journée. Attachez vos cheveux ou utilisez un joli bandeau pour masquer les racines lors de ce "jour de transition".</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">2. Le secret du brossage le soir</h2>
        <p>Le sébum est en réalité un soin naturel exceptionnel pour vos pointes. Chaque soir, prenez une brosse propre et brossez vos cheveux des racines jusqu'aux pointes. Cela répartit le sébum (évitant l'effet racine grasse) et nourrit vos longueurs pendant la nuit.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">3. Arrêter de toucher ses cheveux</h2>
        <p>On ne s'en rend pas compte, mais passer la main dans ses cheveux toute la journée dépose de la saleté et stimule la production de gras. Gardez les mains dans les poches !</p>

        <div class="bg-orange-50 p-6 rounded-xl mt-8 border border-orange-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">L'astuce de Julie :</h3>
          <p class="text-sm">Si vous utilisez du shampoing sec en dépannage, appliquez-le <strong>la veille au soir</strong> avant de dormir, et non le matin même. Il absorbera le sébum pendant la nuit sans laisser de traces blanches !</p>
        </div>
      </div>
    `,
  },
  {
    slug: "faut-il-laver-cheveux-avant-couleur",
    title: "Faut-il se laver les cheveux avant mon rendez-vous couleur ?",
    excerpt: "Cheveux propres ou sales ? C'est LA question que l'on me pose le plus souvent avant mon arrivée. Voici la réponse définitive pour garantir un résultat parfait.",
    date: "2026-06-01",
    readTime: "2 min",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
    author: { name: "Julie", role: "Votre coiffeuse à domicile", avatar: "/images/julie-avatar.jpg" },
    content: `
      <div class="space-y-6 text-gray-700 leading-relaxed">
        <p class="text-lg font-medium text-gray-900">À chaque fois qu'une nouvelle cliente réserve une prestation à domicile dans la région de Seneffe, la question tombe : "Est-ce que je dois me laver les cheveux avant que tu arrives ?". La réponse dépend en réalité de ce que nous allons faire !</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">Pour une coloration classique (couvrir les cheveux blancs)</h2>
        <p>Venez avec des <strong>cheveux de 2 ou 3 jours</strong> ! Le sébum naturel présent sur vos racines va créer une barrière protectrice sur votre cuir chevelu. Cela évite les petits picotements que la couleur peut parfois provoquer. Inutile donc de filer sous la douche avant mon arrivée.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">Pour un balayage ou des mèches</h2>
        <p>La règle est légèrement différente. Pour que la poudre décolorante pénètre uniformément, il est préférable de travailler sur des <strong>cheveux propres de la veille ou de l'avant-veille</strong>. Surtout, évitez de mettre de la laque, du gel ou de l'huile capillaire ce jour-là, car cela empêche le produit de faire son travail correctement.</p>

        <h2 class="text-2xl font-semibold text-[#b85d38] mt-8 mb-4">Et pour une simple coupe ?</h2>
        <p>Ne vous en faites pas ! J'arrive toujours équipée de mon bac à shampoing professionnel. Je m'occupe de tout le processus, de la préparation au nettoyage, pour que vous n'ayez qu'à vous asseoir et profiter du moment.</p>

        <div class="bg-orange-50 p-6 rounded-xl mt-8 border border-orange-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">L'astuce de Julie :</h3>
          <p class="text-sm">En cas de doute, envoyez-moi un petit message lors de votre réservation. Je vous dirai exactement comment préparer vos cheveux pour que la magie opère parfaitement dans votre salon !</p>
        </div>
      </div>
    `,
  },
];
