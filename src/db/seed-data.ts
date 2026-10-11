// Seed catalog for development. Images are from Unsplash (https://unsplash.com/license).

import type { ImageView } from "./schema/catalog";

export type SeedCategory = { slug: string; name: string };

export type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  /** Category display name; must match a SeedCategory name */
  category: string;
  color: string;
  price: number; // minor units (cents)
  stock: number;
  image: { src: string; alt: string };
  views: ImageView[];
  description: string;
  details: string[];
  badge?: string;
};

export const seedCategories: SeedCategory[] = [
  { slug: "handbags", name: "Handbags" },
  { slug: "bags", name: "Bags" },
  { slug: "shoes", name: "Shoes" },
  { slug: "ready-to-wear", name: "Ready-to-wear" },
  { slug: "jewelry", name: "Jewelry" },
  { slug: "eyewear", name: "Eyewear" },
];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const seedProducts: SeedProduct[] = [
  {
    slug: "structured-top-handle-bag",
    sku: "AT-HB-1042",
    name: "Structured top handle bag",
    category: "Handbags",
    color: "Teal",
    price: 289000,
    stock: 12,
    badge: "New",
    image: {
      src: unsplash("1594223274512-ad4803739b7c"),
      alt: "Teal leather top handle bag with a gold clasp",
    },
    views: [
      { alt: "Close-up of the gold push-lock clasp", x: 52, y: 62, zoom: 2.4 },
      { alt: "Detail of the rolled top handle", x: 62, y: 40, zoom: 2 },
    ],
    description:
      "A structured top handle bag in pebbled calfskin, finished with a polished push-lock clasp. The interior is lined in suede and fitted with a flat pocket, sized for the essentials of the day.",
    details: [
      "Pebbled calfskin with suede lining",
      "Gold-toned hardware",
      "Push-lock closure",
      "Detachable shoulder strap",
      "W 26cm × H 19cm × D 11cm",
      "Made in Italy",
    ],
  },
  {
    slug: "crystal-bow-sandal",
    sku: "AT-SH-2210",
    name: "Crystal bow sandal",
    category: "Shoes",
    color: "Nude",
    price: 98000,
    stock: 0,
    image: {
      src: unsplash("1590099033615-be195f8d575c"),
      alt: "Pair of nude suede heeled sandals with crystal bows on an orange floor",
    },
    views: [
      { alt: "Close-up of the crystal-embellished bow", x: 48, y: 52, zoom: 2.4 },
      { alt: "Detail of the slender heel and ankle strap", x: 80, y: 33, zoom: 2.4 },
    ],
    description:
      "A barely-there sandal in soft suede, finished with a hand-applied crystal bow at the toe. The slender 100mm heel and adjustable ankle strap make it an evening essential.",
    details: [
      "Kid suede upper",
      "Hand-applied crystal bow",
      "Adjustable ankle strap with buckle",
      "100mm heel",
      "Leather sole",
      "Made in Italy",
    ],
  },
  {
    slug: "leather-biker-jacket",
    sku: "AT-RW-3307",
    name: "Leather biker jacket",
    category: "Ready-to-wear",
    color: "Black",
    price: 465000,
    stock: 6,
    badge: "New",
    image: {
      src: unsplash("1521223890158-f9f7c3d5d504"),
      alt: "Black leather biker jacket worn open over a black T-shirt",
    },
    views: [
      { alt: "Close-up of the snap-down lapel", x: 80, y: 22, zoom: 2.4 },
      { alt: "Detail of the zipped chest pocket", x: 12, y: 42, zoom: 2.4 },
    ],
    description:
      "Our signature biker in supple lambskin, cut close through the body with an asymmetric zip and wide notched lapels. Washed after construction for a soft, lived-in hand from the first wear.",
    details: [
      "Lambskin leather",
      "Cupro lining",
      "Asymmetric front zip",
      "Zipped cuffs and pockets",
      "Regular fit; true to size",
      "Specialist leather clean only",
    ],
  },
  {
    slug: "crescent-pendant-necklace",
    sku: "AT-JW-4120",
    name: "Crescent pendant necklace",
    category: "Jewelry",
    color: "Gold",
    price: 54000,
    stock: 3,
    image: {
      src: unsplash("1599643478518-a784e5dc4c8f"),
      alt: "Gold chain necklaces with crescent and crystal pendants",
    },
    views: [
      { alt: "Close-up of the crescent pendant", x: 50, y: 78, zoom: 2.4 },
      { alt: "Detail of the faceted crystal charm", x: 50, y: 30, zoom: 2.4 },
    ],
    description:
      "A fine cable chain carrying a crescent pendant set with small crystals, layered with a faceted blue charm. Designed to be worn alone or stacked with other chains.",
    details: [
      "18k gold-plated sterling silver",
      "Crystal and glass stones",
      "Chain length 45cm, adjustable to 42cm",
      "Lobster clasp",
    ],
  },
  {
    slug: "chevron-chain-bag",
    sku: "AT-HB-1188",
    name: "Chevron chain shoulder bag",
    category: "Handbags",
    color: "Blush",
    price: 215000,
    stock: 9,
    image: {
      src: unsplash("1566150905458-1bf1fc113f0d"),
      alt: "Pink shoulder bag with a chevron panel and chain strap",
    },
    views: [
      { alt: "Detail of the inlaid chevron panel", x: 45, y: 40, zoom: 2.2 },
      { alt: "Close-up of the chain strap", x: 80, y: 70, zoom: 2.4 },
    ],
    description:
      "A compact flap bag in smooth leather, inlaid with a contrast chevron panel. The sliding chain strap can be worn long across the body or doubled on the shoulder.",
    details: [
      "Smooth calfskin",
      "Contrast leather inlay",
      "Magnetic flap closure",
      "Sliding chain strap, 120cm drop",
      "W 22cm × H 14cm × D 6cm",
      "Made in Italy",
    ],
  },
  {
    slug: "suede-brogue",
    sku: "AT-SH-2384",
    name: "Suede brogue",
    category: "Shoes",
    color: "Sage",
    price: 79000,
    stock: 14,
    image: {
      src: unsplash("1560343090-f0409e92791a"),
      alt: "Green suede brogue on a pale pink plinth",
    },
    views: [
      { alt: "Detail of the perforated wingtip toe", x: 80, y: 68, zoom: 2.4 },
      { alt: "Close-up of the suede vamp and stitching", x: 55, y: 60, zoom: 2.4 },
    ],
    description:
      "A classic wingtip brogue reworked in soft sage suede, with traditional perforations and a slim leather sole. Built on a refined last for an elegant, elongated profile.",
    details: [
      "Calf suede upper",
      "Leather sole and lining",
      "Goodyear-welted construction",
      "Made in Portugal",
    ],
  },
  {
    slug: "round-metal-sunglasses",
    sku: "AT-EY-5016",
    name: "Round metal sunglasses",
    category: "Eyewear",
    color: "Gold / green",
    price: 46000,
    stock: 21,
    image: {
      src: unsplash("1511499767150-a48a237f0083"),
      alt: "Round gold-rimmed sunglasses with green lenses",
    },
    views: [
      { alt: "Detail of the bridge and nose pads", x: 50, y: 50, zoom: 2.6 },
      { alt: "Close-up of the temple hinge", x: 82, y: 42, zoom: 2.6 },
    ],
    description:
      "Round sunglasses with a fine gold-tone metal frame and mineral green lenses. Lightweight and adjustable, with full UV protection.",
    details: [
      "Metal frame with gold-tone finish",
      "Mineral glass lenses, 100% UV protection",
      "Adjustable nose pads",
      "Lens 49mm, bridge 21mm, temple 145mm",
      "Leather case included",
    ],
  },
  {
    slug: "technical-bomber",
    sku: "AT-RW-3451",
    name: "Technical bomber jacket",
    category: "Ready-to-wear",
    color: "Rust",
    price: 198000,
    stock: 1,
    image: {
      src: unsplash("1591047139829-d91aecb6caea"),
      alt: "Rust bomber jacket held up on a hanger",
    },
    views: [
      { alt: "Close-up of the ribbed collar and zip", x: 45, y: 25, zoom: 2.4 },
      { alt: "Detail of the welt pocket", x: 35, y: 62, zoom: 2.4 },
    ],
    description:
      "A lightweight bomber in water-repellent technical nylon, with ribbed collar, cuffs and hem. A relaxed shape that layers easily over knitwear.",
    details: [
      "Water-repellent nylon",
      "Ribbed knit trims",
      "Two-way front zip",
      "Welt pockets",
      "Relaxed fit; size down for a closer fit",
    ],
  },
  {
    slug: "sapphire-drop-earrings",
    sku: "AT-JW-4231",
    name: "Sapphire drop earrings",
    category: "Jewelry",
    color: "Silver / blue",
    price: 125000,
    stock: 4,
    image: {
      src: unsplash("1535632066927-ab7c9ab60908"),
      alt: "Crystal and blue stone drop earrings on a leaf",
    },
    views: [
      { alt: "Close-up of the blue stone and crystal halo", x: 58, y: 68, zoom: 2.4 },
      { alt: "Detail of the crystal setting", x: 38, y: 40, zoom: 2.4 },
    ],
    description:
      "Statement drop earrings with a pear-cut blue stone framed by a halo of baguette crystals. Each stone is set by hand in rhodium-plated metal.",
    details: [
      "Rhodium-plated brass",
      "Glass stones and crystals",
      "Post back",
      "Drop length 5.5cm",
    ],
  },
  {
    slug: "city-backpack",
    sku: "AT-BG-6012",
    name: "City backpack",
    category: "Bags",
    color: "Navy",
    price: 132000,
    stock: 8,
    image: {
      src: unsplash("1553062407-98eeb64c6a62"),
      alt: "Navy backpack standing on a light floor",
    },
    views: [
      { alt: "Detail of the front pocket", x: 50, y: 50, zoom: 2.2 },
      { alt: "Close-up of the top handle and zip", x: 50, y: 25, zoom: 2.4 },
    ],
    description:
      "A clean-lined backpack in durable recycled canvas with leather trims. A padded sleeve holds a 15-inch laptop, and the front pocket keeps small items within reach.",
    details: [
      "Recycled cotton canvas with leather trims",
      "Padded laptop sleeve, fits 15 inch",
      "Zip front pocket",
      "Adjustable padded straps",
      "W 30cm × H 42cm × D 14cm",
    ],
  },
  {
    slug: "fringed-knit-poncho",
    sku: "AT-RW-3520",
    name: "Fringed knit poncho",
    category: "Ready-to-wear",
    color: "Ivory",
    price: 112000,
    stock: 5,
    image: {
      src: unsplash("1434389677669-e08b4cac3105"),
      alt: "Cream knit poncho with fringe on a wooden hanger",
    },
    views: [
      { alt: "Close-up of the open knit", x: 50, y: 45, zoom: 2.4 },
      { alt: "Detail of the fringed hem", x: 40, y: 82, zoom: 2.4 },
    ],
    description:
      "An airy poncho knitted in a soft cotton and cashmere blend, finished with a hand-knotted fringe. Its open stitch makes it an easy layer from late summer into autumn.",
    details: [
      "80% cotton, 20% cashmere",
      "Hand-knotted fringe",
      "V-neck",
      "One size",
      "Hand wash cold, dry flat",
    ],
  },
  {
    slug: "tailored-jogger",
    sku: "AT-RW-3612",
    name: "Tailored jogger",
    category: "Ready-to-wear",
    color: "Blush",
    price: 89000,
    stock: 0,
    image: {
      src: unsplash("1594633312681-425c7b97ccd1"),
      alt: "Blush pink tailored trousers with heels",
    },
    views: [
      { alt: "Detail of the patch pocket", x: 50, y: 15, zoom: 2.4 },
      { alt: "Close-up of the cuffed ankle", x: 50, y: 82, zoom: 2.4 },
    ],
    description:
      "Tailoring meets ease in a jogger cut from fluid crepe, with front pleats, slant pockets and elasticated cuffs. Dress it up with heels or down with sneakers.",
    details: [
      "Viscose crepe",
      "Elasticated waist and cuffs",
      "Front pleats and slant pockets",
      "Relaxed fit through the leg",
      "Dry clean",
    ],
  },
  {
    slug: "graphic-cotton-tee",
    sku: "AT-RW-3705",
    name: "Graphic cotton T-shirt",
    category: "Ready-to-wear",
    color: "Black",
    price: 52000,
    stock: 18,
    image: {
      src: unsplash("1503342217505-b0a15ec3261c"),
      alt: "Model in a black graphic T-shirt and tinted glasses against a pink wall",
    },
    views: [
      { alt: "Close-up of the printed graphic", x: 50, y: 52, zoom: 2.2 },
      { alt: "Detail of the crew neckline", x: 50, y: 32, zoom: 2.4 },
    ],
    description:
      "A relaxed T-shirt in heavyweight organic cotton jersey, screen-printed with a hand-drawn graphic. Garment-dyed for a soft, slightly faded finish.",
    details: [
      "100% organic cotton jersey",
      "Screen-printed graphic",
      "Crew neck",
      "Relaxed fit",
      "Machine wash cold",
    ],
  },
];
