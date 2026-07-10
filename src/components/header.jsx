import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import {
  UserCircle,
  CookingPot,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { useAuth } from "@/components/authcontext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  {
    title: "Breakfast",
    href: "/search?category=breakfast",
    description: "Start your day with energy.",
  },
  {
    title: "Lunch",
    href: "/search?category=lunch",
    description: "Quick and delicious midday meals.",
  },
  {
    title: "Dinner",
    href: "/search?category=dinner",
    description: "Hearty meals for the evening.",
  },
  {
    title: "Dessert",
    href: "/search?category=dessert",
    description: "Satisfy your sweet cravings.",
  },
  {
    title: "Vegan",
    href: "/search?category=vegan",
    description: "Plant-based goodness.",
  },
  {
    title: "High Protein",
    href: "/search?category=high-protein",
    description: "Fuel your fitness goals.",
  },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth(); // Hook into your auth state
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link to={ROUTES.HOME} onClick={closeMenu}>
          <div className="flex items-center gap-2 pr-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CookingPot className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Premium<span className="text-primary">Cookbook</span>
            </span>
          </div>
        </Link>

        <div className="flex-1 hidden lg:flex justify-center">
          <NavigationMenuDemo />
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4">
          <div className="hidden md:block">
            <InputGroupDemo />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          {/* DYNAMIC USER ACTIONS */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Button
                size="sm"
                className="hidden lg:flex gap-1.5 rounded-full"
                onClick={() => navigate("/create")}
              >
                <Plus className="size-4" /> Create Recipe
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all overflow-hidden"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/feed")}>
                    My Feed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
            >
              <UserCircle className="size-6" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-4">
            <div className="md:hidden pb-2">
              <InputGroupDemo />
            </div>
            <Link
              to={ROUTES.HOME}
              onClick={closeMenu}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/create"
                onClick={closeMenu}
                className="text-lg font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                <Plus className="size-5" /> Create Recipe
              </Link>
            )}
            <hr className="border-border/50" />
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              <UserCircle className="size-5" /> Account Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// Sub-components kept exactly as you had them, just swapped <a> for <Link> in ListItem for SPA routing
function InputGroupDemo() {
  return (
    <InputGroup className="max-w-xs w-full">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupAddon
        align="inline-end"
        className="text-xs text-muted-foreground"
      >
        12 results
      </InputGroupAddon>
    </InputGroup>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu className="relative z-10 flex max-w-max flex-1 items-center justify-center p-4">
      <NavigationMenuList>
        {/* Categories Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((cat) => (
                <ListItem key={cat.title} title={cat.title} href={cat.href}>
                  {cat.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Simple Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to={ROUTES.FEED}>Explore All</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          {...props}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
