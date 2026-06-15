import Skeleton from "./fading_skeleton";
import { useState, useEffect } from "react";

export function FeatureWithIllustration() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16">
      <div className="flex-1 space-y-4">
        <h2 className="text-4xl font-bold">Precision in every step.</h2>
        <p className="text-muted-foreground text-lg">
          Our visual guides break down complex thermal dynamics and chemical
          reactions so you never overcook a protein again.
        </p>
      </div>
      <div className="flex-1">
        {/* Placeholder for your SVG/Illustration */}
        <div className="w-full h-64 bg-muted rounded-3xl flex items-center justify-center border-2 border-dashed border-border relative">
          <Skeleton isLoading={isLoading} />

          <span className="text-muted-foreground">
            <img
              src="/features.svg"
              className="w-full h-auto object-contain"
              fetchPriority="low"
              loading="lazy"
              decoding="async"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
