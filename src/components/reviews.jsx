import { Star } from "lucide-react";

// 1. The Glass Card Component
function ReviewCard({ name, role, text, rating, avatarInitials }) {
  return (
    <div className="relative p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform duration-300">
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />
      
      {/* Star Rating */}
      <div className="relative flex items-center gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>

      {/* Review Text */}
      <p className="relative text-lg text-foreground/90 leading-relaxed mb-8 italic">
        "{text}"
      </p>

      {/* User Info */}
      <div className="relative flex items-center gap-4">
        {/* Placeholder Avatar - replace with <img> if you have actual photos */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold">
          {avatarInitials}
        </div>
        <div>
          <p className="font-semibold text-foreground text-base">{name}</p>
          <p className="text-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </div>
  );
}

// 2. The Main Section Component
export function ReviewsSection() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Home Chef",
      text: "The thermal dynamics breakdown completely changed how I cook steaks. I haven't overcooked a ribeye since I started using this guide.",
      rating: 5,
      avatarInitials: "SJ"
    },
    {
      name: "Marcus Chen",
      role: "Culinary Student",
      text: "Having all the core techniques open-source is incredible. I reference the emulsification guide during my prep shifts every day.",
      rating: 5,
      avatarInitials: "MC"
    },
    {
      name: "Elena Rodriguez",
      role: "Food Blogger",
      text: "Clean interface, zero ads, and straight to the point. It feels like a premium app, but it's completely free. Absolutely brilliant.",
      rating: 5,
      avatarInitials: "ER"
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      
      {/* Ambient Background Glows (These make the glass work) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Loved by Home Chefs</h2>
          <p className="text-xl text-muted-foreground">Don't just take our word for it.</p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}