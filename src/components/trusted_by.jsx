export function TrustedBy() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by top culinary institutions
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale md:gap-16">
          {/* You can replace these placeholders with actual logo images */}
          {["Le Cordon Bleu", "Culinary Institute", "Michelin Guide", "Food Network"].map((brand) => (
            <span key={brand} className="text-xl font-bold md:text-2xl">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}