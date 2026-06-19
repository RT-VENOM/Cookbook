import { X, Check, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { API, ROUTES } from "@/lib/routes";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { getRequest, postRequest } from "@/lib/api"; // Ensure postRequest is imported
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@/lib/validations";

export function AuthModal({ isOpen, onClose }) {
  const [isSearching, setIsSearching] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AuthSchema),
    defaultValues: { username: "", password: "" },
    mode: "onChange",
  });

  const username = watch("username");

  useEffect(() => {
    if (!username || username.trim() === "") {
      setIsSearching(false);
      setUsernameStatus(null);
      return;
    }

    setIsSearching(true);
    setUsernameStatus(null);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await getRequest(
          `${API.CHECK_USERNAME}?username=${username.trim()}`,
        );
        setUsernameStatus(response.available ? "available" : "taken");
      } catch (error) {
        console.error("Failed to check username", error);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  const onSubmit = async (data) => {
    try {
      const response = await postRequest(API.REGISTER, {
        username: data.username.trim(),
        password: data.password
      });
      console.log("Account created!", response);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row md:min-h-[550px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 text-muted-foreground hover:text-foreground rounded-full"
        >
          <X className="size-5" />
        </Button>

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

        <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Account Sign Up
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldInput
              register={register}
              isSearching={isSearching}
              usernameStatus={usernameStatus}
              errors={errors}
            />

            <div className="mt-6 flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ register, isSearching, usernameStatus, errors }) {
  return (
    <FieldSet>
      <FieldGroup className="space-y-4">
        <Field className="space-y-1.5">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="username"
              type="text"
              placeholder="Max Leiter"
              {...register("username")} // Hooks input to Zod
            />

            {isSearching && (
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            )}

            {!isSearching && usernameStatus === "available" && (
              <InputGroupAddon align="inline-end">
                <Check color="green" />
              </InputGroupAddon>
            )}

            {!isSearching && usernameStatus === "taken" && (
              <InputGroupAddon align="inline-end">
                <CircleAlert color="red" />
              </InputGroupAddon>
            )}
          </InputGroup>
          <FieldDescription>
            {/* Prioritize Zod errors, then fallback to API errors */}
            {errors.username ? (
              <span className="text-red-500 font-medium">
                {errors.username.message}
              </span>
            ) : usernameStatus === "taken" ? (
              <span className="text-red-500 font-medium">
                This username is taken.
              </span>
            ) : (
              "Choose a unique username for your account."
            )}
          </FieldDescription>
        </Field>

        <Field className="space-y-1.5">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")} // Hooks input to Zod
          />
          <FieldDescription>
            {/* Display dynamic Zod error messages */}
            {errors.password ? (
              <span className="text-red-500 font-medium">
                {errors.password.message}
              </span>
            ) : (
              "Must be at least 8 characters long."
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
