// Storefront editorial content. Products themselves are read from the database.
// Images are from Unsplash (https://unsplash.com/license).

import type { ImageAsset } from "@/lib/products";

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: ImageAsset;
};

export type Category = {
  slug: string;
  name: string;
  image: ImageAsset;
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const hero = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Season",
  images: [
    {
      src: unsplash("1581044777550-4cfa60707c03"),
      alt: "Model in a pale pink ruffled dress standing in a golden field",
    },
    {
      src: unsplash("1539109136881-3be0616acf4b"),
      alt: "Model in a pale blue coat in a cathedral square",
    },
  ],
} satisfies { eyebrow: string; title: string; images: ImageAsset[] };

// Curated product lists for the home page, in display order.
export const newArrivalSlugs = [
  "structured-top-handle-bag",
  "crystal-bow-sandal",
  "leather-biker-jacket",
  "crescent-pendant-necklace",
  "chevron-chain-bag",
  "suede-brogue",
  "round-metal-sunglasses",
  "technical-bomber",
];

export const editorsPickSlugs = [
  "sapphire-drop-earrings",
  "city-backpack",
  "fringed-knit-poncho",
  "tailored-jogger",
  "graphic-cotton-tee",
];

export const featuredCollections: Collection[] = [
  {
    slug: "outerwear",
    name: "Outerwear",
    description: "Coats and jackets cut for the colder months.",
    image: {
      src: unsplash("1483985988355-763728e1935b"),
      alt: "Woman in a burgundy coat and sunglasses carrying shopping bags",
    },
  },
  {
    slug: "tailoring",
    name: "Tailoring",
    description: "Sharp suiting in wool and fine cotton.",
    image: {
      src: unsplash("1617137968427-85924c800a22"),
      alt: "Man in a navy suit walking past a glass building",
    },
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    description: "Soft layers in cashmere, wool and mohair.",
    image: {
      src: unsplash("1558769132-cb1aea458c5e"),
      alt: "Neutral knitwear hanging on a rail",
    },
  },
];

export const editorial = {
  eyebrow: "The Atelier",
  title: "Made slowly, made to last",
  body: "Every piece begins in our workshop, where leather is cut by hand and finished over days, not hours. It is a practice of patience, and the result is meant to be kept for years.",
  image: {
    src: unsplash("1445205170230-053b83016050"),
    alt: "Rail of neutral-toned coats and knitwear in a softly lit boutique",
  },
} satisfies { eyebrow: string; title: string; body: string; image: ImageAsset };

export const categories: Category[] = [
  {
    slug: "women",
    name: "Women",
    image: {
      src: unsplash("1485968579580-b6d095142e6e"),
      alt: "Woman in a check coat walking down a city street",
    },
  },
  {
    slug: "men",
    name: "Men",
    image: {
      src: unsplash("1520975954732-35dd22299614"),
      alt: "Man in a leather jacket and sunglasses crouching on a ledge",
    },
  },
  {
    slug: "handbags",
    name: "Handbags",
    image: {
      src: unsplash("1584917865442-de89df76afd3"),
      alt: "Red leather top handle bag on a white plinth",
    },
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    image: {
      src: unsplash("1590548784585-643d2b9f2925"),
      alt: "Layered fine gold necklaces worn over a knit top",
    },
  },
];

export const services = [
  {
    title: "Complimentary shipping",
    body: "Free express delivery on every order, packaged in our signature boxes.",
  },
  {
    title: "Easy returns",
    body: "Return or exchange within 30 days, with a prepaid label included.",
  },
  {
    title: "Personalisation",
    body: "Add hand-painted initials or hot-stamped monograms to selected pieces.",
  },
  {
    title: "Book an appointment",
    body: "Shop in store or by video call with a dedicated client advisor.",
  },
];

export const navigation = [
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Handbags", href: "/handbags" },
  { label: "Shoes", href: "/shoes" },
  { label: "Jewelry", href: "/jewelry" },
  { label: "Gifts", href: "/gifts" },
];
