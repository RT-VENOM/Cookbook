import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { UserCircle, CookingPot, Search, Menu, X, Sun, Moon } from "lucide-react";

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

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description: "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize Dark Mode
  useEffect(() => {
    const isDarkMode = 
      localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
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
        
        {/* Logo Section */}
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

        {/* Desktop Navigation */}
        <div className="flex-1 hidden lg:flex justify-center">
          <NavigationMenuDemo />
        </div>

        {/* Right Actions Section */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          
          <div className="hidden md:block">
            <InputGroupDemo />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <UserCircle className="size-6" />
          </Button>

          {/* Mobile Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-4">
            <div className="md:hidden pb-2">
              <InputGroupDemo />
            </div>
            <Link to={ROUTES.HOME} onClick={closeMenu} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to={ROUTES.DOCS} onClick={closeMenu} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
              Documentation
            </Link>
            <hr className="border-border/50" />
            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary transition-colors">
              <UserCircle className="size-5" /> Account
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
      <InputGroupAddon align="inline-end" className="text-xs text-muted-foreground">
        12 results
      </InputGroupAddon>
    </InputGroup>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu className="relative z-10 flex max-w-max flex-1 items-center justify-center p-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96 p-4 md:w-[500px] lg:w-[600px] space-y-2">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built with Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to={ROUTES.DOCS}>Docs</Link>
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