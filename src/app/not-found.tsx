import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section container-prose flex flex-col items-center text-center">
      <p className="type-eyebrow text-muted">Page not found</p>
      <h1 className="type-h1 mt-5 font-serif">This page is no longer available</h1>
      <p className="mt-5 text-muted">
        The piece you are looking for may have sold out or moved. Continue
        exploring the latest collections.
      </p>
      <Link href="/" className="btn btn-primary mt-10">
        Return to the homepage
      </Link>
    </section>
  );
}
