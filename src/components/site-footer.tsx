import Link from "next/link";

const columns = [
  {
    title: "Client services",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Craftsmanship", href: "/craft" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of sale", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="stack [--stack-gap:--spacing(4)]">
            <h2 className="type-eyebrow">Sign up for updates</h2>
            <p className="type-caption text-paper/70">
              Be the first to hear about new collections, events and private
              appointments.
            </p>
            <Link href="/newsletter" className="link-cta self-start">
              Subscribe
            </Link>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="type-eyebrow">{column.title}</h2>
              <ul className="stack mt-4 [--stack-gap:--spacing(2.5)]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-quiet type-caption text-paper/70 hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p
          className="mt-20 text-center font-serif text-[clamp(3rem,16vw,14rem)] leading-none tracking-[0.2em] uppercase select-none"
          aria-hidden="true"
        >
          Atelier
        </p>

        <div className="mt-10 flex flex-col gap-2 border-t border-paper/20 pt-6 sm:flex-row sm:justify-between">
          <p className="type-caption text-paper/60">© Atelier Store</p>
          <p className="type-caption text-paper/60">United States · English</p>
        </div>
      </div>
    </footer>
  );
}
