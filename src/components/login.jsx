import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    // LAYER 1: The Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* LAYER 2: The Modal Container */}
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row md:min-h-[550px]">
        {/* The Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 text-muted-foreground hover:text-foreground rounded-full"
        >
          <X className="size-5" />
        </Button>

        {/* LAYER 3a: The Left Side (Dark Branding Banner) */}
        <div className="hidden w-[40%] flex-col items-center justify-center bg-zinc-900 p-10 text-white md:flex">
          <img
            src="/login.svg"
            alt="Login Graphic"
            className="w-full max-w-[200px] object-contain"
          />
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold">Welcome Back</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Manage your recipes and sync your cookbook seamlessly.
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden md:block h-auto" />

        {/* LAYER 3b: The Right Side (The Form Area) */}
        <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
          {/* Header text to give the form a professional introduction */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Account Sign In
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Form injection - now flows cleanly without rigid height limits */}
          <FieldInput />

          {/* Action button container */}
          <div className="mt-6 flex flex-col gap-3">
            <Button className="w-full">Sign In</Button>
            <Button variant="outline" className="w-full">
              Create an Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput() {
  return (
    <FieldSet>
      <FieldGroup className="space-y-4">
        <Field className="space-y-1.5">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" type="text" placeholder="Max Leiter" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>

        <Field className="space-y-1.5">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" placeholder="••••••••" />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
