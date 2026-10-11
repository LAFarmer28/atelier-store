"use client";

import Link from "next/link";
import { useRef } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="btn-icon -ml-3"
        aria-label="Open menu"
        onClick={() => dialogRef.current?.showModal()}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper text-ink backdrop:bg-transparent"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="container-page flex h-header items-center">
          <button
            type="button"
            className="btn-icon -ml-3"
            aria-label="Close menu"
            onClick={close}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="container-page pt-8" aria-label="Main">
          <ul className="stack [--stack-gap:--spacing(5)]">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="type-h2" onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="stack mt-12 border-t border-line pt-8 [--stack-gap:--spacing(4)]">
            <li>
              <Link href="/account" className="type-eyebrow" onClick={close}>
                My account
              </Link>
            </li>
            <li>
              <Link href="/services" className="type-eyebrow" onClick={close}>
                Client services
              </Link>
            </li>
            <li>
              <Link href="/stores" className="type-eyebrow" onClick={close}>
                Store locator
              </Link>
            </li>
          </ul>
        </nav>
      </dialog>
    </>
  );
}
