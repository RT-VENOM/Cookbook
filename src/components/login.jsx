import { X, Check, CircleAlert, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API, ROUTES } from "@/lib/routes";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { getRequest, postRequest } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@/lib/validations";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/authcontext"; // Ensure correct import path

export function AuthModal({ isOpen, onClose }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  // NEW: State to toggle between Login and Signup
  const [isLoginMode, setIsLoginMode] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [authError, setAuthError] = useState(null); // To handle login failures

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

  // Only check if username is taken during SIGN UP mode
  useEffect(() => {
    if (isLoginMode || !username || username.trim() === "") {
      setIsSearching(false);
      setUsernameStatus(null);
      return;
    }

    setIsSearching(true);
    setUsernameStatus(null);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await getRequest(
          `${API.CHECK_USERNAME}?username=${username.trim()}`
        );
        setUsernameStatus(response.available ? "available" : "taken");
      } catch (error) {
        console.error("Failed to check username", error);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [username, isLoginMode]);

const onSubmit = async (data) => {
    setAuthError(null);
    try {
      // Determine which endpoint to hit based on mode
      const endpoint = isLoginMode ? API.LOGIN : API.REGISTER;
      
      const response = await postRequest(endpoint, {
        username: data.username.trim(),
        password: data.password,
      });
      
      setUser(response.user);

      // Trigger success animation
      setShowSuccessAlert(true);

      setTimeout(() => {
        setShowSuccessAlert(false);
        setTimeout(() => {
          reset(); 
          onClose(); 
          navigate(ROUTES.FEED);
        }, 500);
      }, 2000);
      
    } catch (error) {
      console.error("Raw Auth Error:", error);
      
      // Intercept nasty JSON/Server errors and provide secure, user-friendly messages
      let friendlyMessage = error.message || "Authentication failed. Please try again.";
      
      // If it's a JSON parse error (meaning the backend crashed or returned HTML)
      if (friendlyMessage.includes("JSON") || friendlyMessage.includes("Unexpected token")) {
          friendlyMessage = isLoginMode 
            ? "Invalid username or password." 
            : "Server error. Please try again later.";
      } 
      // If it's a login attempt, override detailed errors with a generic security message
      else if (isLoginMode) {
          friendlyMessage = "Invalid username or password.";
      }

      setAuthError(friendlyMessage);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setAuthError(null);
    reset(); // Clear form when switching modes
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row md:min-h-[550px]">
        
        {/* Animated Success Alert */}
        <div className={`absolute left-1/2 top-4 z-[100] w-full max-w-md -translate-x-1/2 px-4 transition-all duration-500 ease-in-out ${showSuccessAlert ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"}`}>
          <Alert className="border-green-500/50 bg-green-50/95 text-green-900 backdrop-blur-md shadow-lg">
            <CheckCircle2Icon className="h-4 w-4 !stroke-green-600" />
            <AlertTitle>{isLoginMode ? "Login successful!" : "Registration successful!"}</AlertTitle>
            <AlertDescription>
              {isLoginMode ? "Welcome back to your cookbook." : "Your account has been created."}
            </AlertDescription>
          </Alert>
        </div>

        <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </Button>

        {/* Left Graphic Side */}
        <div className="hidden w-[40%] flex-col items-center justify-center bg-zinc-900 p-10 text-white md:flex">
          <img src="/login.svg" alt="Login Graphic" className="w-full max-w-[200px] object-contain" />
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold">{isLoginMode ? "Welcome Back" : "Join Us"}</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Manage your recipes and sync your cookbook seamlessly.
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-auto md:block" />

        {/* Form Side */}
        <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {isLoginMode ? "Account Login" : "Account Sign Up"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoginMode ? "Enter your credentials to access your account." : "Create an account to access your dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup className="space-y-4">
                
                {/* Error Banner for bad passwords/usernames */}
                {authError && (
                  <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                    {authError}
                  </div>
                )}

                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="username" type="text" placeholder="ChefMax" {...register("username")} />
                    {!isLoginMode && isSearching && <InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon>}
                    {!isLoginMode && !isSearching && usernameStatus === "available" && <InputGroupAddon align="inline-end"><Check color="green" /></InputGroupAddon>}
                    {!isLoginMode && !isSearching && usernameStatus === "taken" && <InputGroupAddon align="inline-end"><CircleAlert color="red" /></InputGroupAddon>}
                  </InputGroup>
                  <FieldDescription>
                    {errors.username ? (
                      <span className="font-medium text-red-500">{errors.username.message}</span>
                    ) : (!isLoginMode && usernameStatus === "taken") ? (
                      <span className="font-medium text-red-500">This username is taken.</span>
                    ) : (
                      isLoginMode ? "" : "Choose a unique username for your account."
                    )}
                  </FieldDescription>
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                  <FieldDescription>
                    {errors.password && <span className="font-medium text-red-500">{errors.password.message}</span>}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="mt-6 flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting || showSuccessAlert || (!isLoginMode && usernameStatus === "taken")} className="w-full">
                {isSubmitting ? "Processing..." : (isLoginMode ? "Login" : "Sign Up")}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={toggleMode}>
                {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}