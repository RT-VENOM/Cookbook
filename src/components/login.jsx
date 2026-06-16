import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// We pass `isOpen` and `onClose` as props so the Header can control when this opens and closes
export function AuthModal({ isOpen, onClose }) {
  // If the modal isn't open, don't render anything at all
  if (!isOpen) return null;

  return (
    // LAYER 1: The Overlay (Darkens the background and blurs it slightly)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* LAYER 2: The Card Wrapper*/}
      {/* relative: allows us to absolute-position the close button */}
      {/* max-w-4xl: makes it nice and wide for the split layout */}
      {/* overflow-hidden: ensures the left/right background colors don't bleed out of the rounded corners */}
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row md:min-h-[500px]">
        {/* The Close Button (Floating in the top right) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </Button>

        {/* LAYER 3a: The Left Side (Dark Branding) */}
        {/* hidden md:flex ensures the dark branding side disappears on tiny mobile screens to save space */}
        <div className="hidden w-[40%] flex-col justify-center bg-slate-950 p-10 text-white md:flex">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back to Cookbook
            </h2>
            {/* The Accent Line from your image */}
            <div className="h-1.5 w-12 rounded-full bg-primary" />
            <p className="text-sm text-slate-400">
              Sign in to continue to your recipes.
            </p>
          </div>
        </div>

        {/* LAYER 3b: The Right Side (The Form Area) */}
        <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
          <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30">
            <span className="text-sm font-medium text-muted-foreground">
              We will build the OAuth buttons and Inputs here next
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
