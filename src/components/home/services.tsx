import { services } from "@/lib/catalog";

export function Services() {
  return (
    <section className="container-page" aria-labelledby="services-title">
      <div className="hairline section">
        <h2 id="services-title" className="sr-only">
          Our services
        </h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-gutter">
          {services.map((service) => (
            <li key={service.title} className="stack [--stack-gap:--spacing(3)]">
              <h3 className="type-eyebrow">{service.title}</h3>
              <p className="type-caption max-w-xs text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
