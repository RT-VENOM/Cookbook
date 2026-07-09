import { useState, useEffect } from "react";
import Skeleton from "./fading_skeleton";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./login";
import { useAuth } from "@/components/authcontext"; 
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, SetisAuthModelOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 1. Added 'relative', 'isolate', and 'overflow-hidden' to trap the background
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center py-12 lg:py-0 overflow-hidden">
      {/* ==================== THE AMBIENT GLOW BACKGROUND ==================== */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        {/* We use the same image, but blow it out with a massive blur (blur-[120px]) */}
        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 blur-[120px] saturate-200"
          aria-hidden="true"
        />
        {/* A subtle gradient overlay so the text remains easy to read */}
        <div className="absolute inset-0 bg-background/40 bg-gradient-to-t from-background to-transparent" />
      </div>
      {/* ==================================================================== */}

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* LEFT SIDE: TYPOGRAPHY & BUTTONS */}
          <div className="flex flex-col space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block self-center lg:self-start rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                ✨ The Ultimate Culinary Platform
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
                Master the Art of{" "}
                <span className="text-primary">Fine Cooking.</span>
              </h1>
              <p className="mx-auto max-w-[600px] text-lg text-muted-foreground sm:text-xl lg:mx-0">
                Elevate your home kitchen with perfectly engineered recipes,
                step-by-step techniques, and pro-level plating guides.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-base font-medium" onClick={()=> {navigate(ROUTES.FEED)}}>
                Explore Recipes
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium bg-background/50 backdrop-blur-sm"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(ROUTES.FEED);
                  } else {
                    SetisAuthModelOpen(true);
                  }
                }}
              >
                {isAuthenticated ? `Welcome, ${user?.username}` : "Create an Account"}
              </Button>
              {isAuthModalOpen && (
                <AuthModal
                  isOpen={isAuthModalOpen}
                  onClose={() => {
                    SetisAuthModelOpen(false);
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE: IMAGE FRAME */}
          <div className="relative mx-auto aspect-video w-full max-w-[500px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border lg:max-w-none lg:aspect-[4/5] xl:aspect-video">
            <Skeleton isLoading={isLoading} />
            <img
              src="/hero.jpg"
              className="h-full w-full object-cover"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
