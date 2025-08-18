/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
 
const reviews = [
  {
    name: "Marie",
    username: "@mariedubois",
    body: "Webstate a révolutionné notre support client. Nous avons réduit le temps de réponse de 80% et nos clients sont ravis !",
    img: "https://avatar.vercel.sh/marie",
  },
  {
    name: "Thomas",
    username: "@thomasmartin",
    body: "L'automatisation des tâches répétitives nous fait gagner 15h par semaine. Un investissement qui se rentabilise immédiatement !",
    img: "https://avatar.vercel.sh/thomas",
  },
  {
    name: "Sophie",
    username: "@sophiebernard",
    body: "Nos agents IA gèrent maintenant 90% de nos interactions clients. L'équipe peut se concentrer sur les cas complexes !",
    img: "https://avatar.vercel.sh/sophie",
  },
  {
    name: "Alexandre",
    username: "@alexandremoreau",
    body: "La mise en place a été ultra-rapide. En 48h, nos premiers agents étaient opérationnels. Incroyable !",
    img: "https://avatar.vercel.sh/alexandre",
  },
  {
    name: "Léa",
    username: "@learousseau",
    body: "ROI exceptionnel ! Nous avons augmenté notre productivité de 200% en seulement 3 mois d'utilisation.",
    img: "https://avatar.vercel.sh/lea",
  },
  {
    name: "David",
    username: "@davidleroy",
    body: "L'intégration avec nos outils existants a été transparente. L'équipe Webstate est vraiment professionnelle !",
    img: "https://avatar.vercel.sh/david",
  },
];
 
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);
 
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};
 
export function Marquee3D() {
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <div className="flex flex-col gap-4 animate-marquee-3d-vertical">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </div>
        <div className="flex flex-col gap-4 animate-marquee-3d-vertical-reverse">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </div>
        <div className="flex flex-col gap-4 animate-marquee-3d-vertical-reverse">
          {thirdRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </div>
        <div className="flex flex-col gap-4 animate-marquee-3d-vertical">
          {fourthRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </div>
      </div>
 
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
