import { ChefHat, Timer, BookOpen } from "lucide-react";

const features = [
  {
    name: "Curated by Experts",
    description: "Every recipe is tested and perfected by Michelin-star chefs to guarantee flawless results.",
    icon: ChefHat,
  },
  {
    name: "Lightning Fast",
    description: "Filter hundreds of recipes by prep time. Find gourmet meals that fit your busy schedule.",
    icon: Timer,
  },
  {
    name: "Detailed Techniques",
    description: "Master the fundamentals with step-by-step visual guides for complex culinary techniques.",
    icon: BookOpen,
  },
];

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-24 md:px-8 border-t border-border">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Cook like a professional.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to elevate your home cooking in one premium, high-performance platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div 
            key={feature.name} 
            className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold tracking-tight">{feature.name}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}