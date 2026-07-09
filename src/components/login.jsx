import { X, Check, CircleAlert, CheckCircle2Icon } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API } from "@/lib/routes";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { getRequest, postRequest } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@/lib/validations";
import { useNavigate } from "react-router-dom"; // <-- Add this at the top
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/components/authcontext";
export function AuthModal({ isOpen, onClose }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
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
        password: data.password,
      });
      setUser(response.user);

      console.log("Account created!", response);

      // 1. Trigger the alert to slide down and fade in
      setShowSuccessAlert(true);

      // 2. Wait 2 seconds for the user to read it, then slide it back up
      setTimeout(() => {
        setShowSuccessAlert(false);

        // 3. Wait 500ms for the slide-up animation to finish, then completely close
        setTimeout(() => {
          reset(); // Clear the form fields
          onClose(); // Unmount the modal
          navigate(ROUTES.FEED);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row md:min-h-[550px]">
        {/* --- THE ANIMATED SUCCESS ALERT --- */}
        <div
          className={`absolute left-1/2 top-4 z-[100] w-full max-w-md -translate-x-1/2 px-4 transition-all duration-500 ease-in-out ${
            showSuccessAlert
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-8 opacity-0"
          }`}
        >
          {/* I added some slight green styling to make it feel like a true success alert */}
          <Alert className="border-green-500/50 bg-green-50/95 text-green-900 backdrop-blur-md dark:bg-green-950/90 dark:text-green-200 shadow-lg">
            <CheckCircle2Icon className="h-4 w-4 !stroke-green-600 dark:!stroke-green-400" />
            <AlertTitle>Registration successful!</AlertTitle>
            <AlertDescription>
              Your account has been created. Getting your cookbook ready...
            </AlertDescription>
          </Alert>
        </div>
        {/* -------------------------------- */}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full text-muted-foreground hover:text-foreground"
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

        <Separator orientation="vertical" className="hidden h-auto md:block" />

        <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Account Sign Up
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
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
              <Button
                type="submit"
                disabled={isSubmitting || showSuccessAlert}
                className="w-full"
              >
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
  // ... Keep this exactly as you had it previously ...
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
              {...register("username")}
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
            {errors.username ? (
              <span className="font-medium text-red-500">
                {errors.username.message}
              </span>
            ) : usernameStatus === "taken" ? (
              <span className="font-medium text-red-500">
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
            {...register("password")}
          />
          <FieldDescription>
            {errors.password ? (
              <span className="font-medium text-red-500">
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
