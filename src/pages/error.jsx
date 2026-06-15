// src/pages/error-page.jsx (Final: The "Senior" Design)
import { X, ArrowLeft, BotMessageSquare } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  // BONUS: React Router provides a hook to see what exactly went wrong
  const error = useRouteError();
  // Typically "Not Found" for a missing page, or "Internal Server Error" for crashes
  console.error(error); 

  return (
    // Step 1: Layout Container (Spacing, alignment, and a glowing ambient background orb)
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-center">
      
      {/* Step 2: Background Glow (Matches the glassmorphic orb effect used elsewhere) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Step 3: Main Visual Hierarchy */}
      <div className="container relative z-10 mx-auto max-w-xl space-y-10">
        
        {/* Step 3a: Top Visual (Illustration and a floating badge) */}
        <div className="relative flex items-center justify-center">
          
          {/* Main icon */}
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-muted border border-border">
            <X className="size-16 text-muted-foreground/60" />
          </div>

          {/* Floating 'chatbot' badge to make the illustration more complex */}
          <div className="absolute -top-6 -right-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 p-4 text-primary shadow-xl backdrop-blur-md">
            <BotMessageSquare className="size-6" strokeWidth={1.5}/>
          </div>
        </div>

        {/* Step 3b: Text Content */}
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold tracking-tighter text-foreground/10">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Recipe not found.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            It looks like we can't find that page. Either the ingredients were moved, or the chef mistyped the URL. 
          </p>
        </div>

        {/* Step 3c: Call to Action (Button) */}
        <div className="flex items-center justify-center pt-8">
          <Button size="lg" asChild className="group h-14 rounded-full px-10 text-lg shadow-lg">
            <Link to={ROUTES.HOME}>
              {/* Subtle animation on the arrow icon on hover */}
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}