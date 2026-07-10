import { useState, useEffect } from "react";
import { CookingPot } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function InitialLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulates a fast initial load that slows down right before 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        // Increment faster at the start, slower at the end
        const increment = prev < 50 ? 15 : prev < 85 ? 5 : 2;
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl">
      <div className="flex flex-col items-center gap-10 max-w-sm w-full px-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Glowing Logo Block */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/40 blur-[40px] rounded-full animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 ring-1 ring-white/20">
            <CookingPot className="size-12" />
          </div>
        </div>

        {/* Branding & Status */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Premium<span className="text-primary">Cookbook</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Warming up the ovens...
          </p>
        </div>

        {/* The Shadcn Progress Bar */}
        <div className="w-full space-y-3">
          <Progress value={progress} className="h-1.5 w-full bg-muted/50 overflow-hidden rounded-full" />
          <div className="flex justify-between items-center text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
            <span>Authenticating</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}