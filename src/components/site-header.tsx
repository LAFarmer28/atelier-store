import Link from "next/link";

import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";
import { navigation } from "@/lib/catalog";

export function SiteHeader() {
  return (
    <>
      <div className="bg-surface">
        <p className="container-page type-eyebrow py-2.5 text-center">
          Complimentary shipping and returns
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="container-page grid h-header grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <div className="xl:hidden">
              <MobileMenu items={navigation} />
            </div>
            <nav className="hidden xl:block" aria-label="Main">
              <ul className="cluster [--cluster-gap:--spacing(7)]">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-quiet type-eyebrow">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="font-serif text-xl tracking-[0.3em] uppercase md:text-2xl"
            aria-label="Atelier Store home"
          >
            Atelier
          </Link>

          <div className="-mr-3 flex items-center justify-end">
            <Link href="/search" className="btn-icon" aria-label="Search">
              <SearchIcon />
            </Link>
            <Link
              href="/account"
              className="btn-icon max-sm:hidden"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link href="/bag" className="btn-icon" aria-label="Shopping bag">
              <BagIcon />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
