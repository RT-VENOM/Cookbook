import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  Sparkles,
  BookOpen,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/authcontext";

// --- MOCK API CALL ---
const fetchRecipesAPI = async (page, query, filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosts = Array.from({ length: 5 }).map((_, i) => ({
        id: `${page}-${i}-${Date.now()}`,
        author: `Chef_${Math.floor(Math.random() * 100)}`,
        title: query
          ? `${query} Recipe ${page}-${i}`
          : `Delicious Meal ${page}-${i}`,
        description:
          "A wonderful dish that brings out the best of our warm, organic color palette.",
        time: "45 mins",
        category: filters.category || "All",
        likes: Math.floor(Math.random() * 500),
        image: `https://picsum.photos/seed/${page}${i}/1200/800`,
      }));
      resolve({
        data: newPosts,
        hasMore: page < 5,
      });
    }, 800);
  });
};

export default function RecipeFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Vegan",
    "High Protein",
    "Quick Prep",
    "Liked",
    "Bookmarked",
  ];

  const observer = useRef();
  const preloadOffset = 3;

  const triggerPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const loadPosts = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const response = await fetchRecipesAPI(pageNum, searchQuery, {
        category: activeCategory,
      });
      setPosts((prev) => (reset ? response.data : [...prev, ...response.data]));
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to load recipes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(page, false);
  }, [page]);
  useEffect(() => {
    setPage(1);
    loadPosts(1, true);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-8 font-sans selection:bg-primary/30">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* ========================================= */}
        {/* LEFT SIDEBAR: SLEEK NAVIGATION            */}
        {/* ========================================= */}
        <aside className="lg:col-span-3 xl:col-span-2 hidden md:block">
          {/* Increased top-24 so it clears your main navbar */}
          <div className="sticky top-24 flex flex-col gap-10">
            
            {/* Main Categories */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground/60 uppercase px-4">
                Discover
              </h3>
              <nav className="flex flex-col space-y-1">
                {["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Vegan", "High Protein", "Quick Prep"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeCategory === cat
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && (
                      <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(222,137,72,0.6)] animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* User Library Section */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground/60 uppercase px-4">
                Your Library
              </h3>
              <nav className="flex flex-col space-y-1">
                {["Liked", "Bookmarked"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeCategory === cat
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && (
                      <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(222,137,72,0.6)] animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

          </div>
        </aside>

        {/* ========================================= */}
        {/* CENTER: IMMERSIVE MAIN FEED               */}
        {/* ========================================= */}
        <main className="lg:col-span-6 xl:col-span-7 flex flex-col gap-10">
          <div className="flex items-end justify-between border-b border-border/50 pb-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {activeCategory === "All" ? "For You" : activeCategory}
            </h2>
            <span className="text-sm font-medium text-muted-foreground">
              {posts.length} {posts.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>

          <div className="flex flex-col gap-14">
            {posts.map((post, index) => {
              const isTriggerPost = posts.length === index + preloadOffset;
              return (
                <div
                  key={post.id}
                  ref={isTriggerPost ? triggerPostRef : null}
                  className="group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  {/* Cinematic Image with Floating Overlay Actions */}
                  <div className="w-full aspect-video relative overflow-hidden rounded-[2rem] bg-muted shadow-sm">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for Text Readability & Action Buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-background/80 backdrop-blur-md hover:bg-background text-foreground shadow-lg"
                      >
                        <Bookmark className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Minimalist Meta & Content */}
                  <div className="flex flex-col px-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-[10px]">
                          {post.author.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-muted-foreground text-sm tracking-tight hover:text-foreground cursor-pointer transition-colors">
                          {post.author}
                        </h4>
                      </div>
                      <div className="flex gap-3 text-muted-foreground">
                        <button className="flex items-center gap-1.5 hover:text-destructive transition-colors">
                          <Heart className="size-4" />
                          <span className="text-xs font-semibold">
                            {post.likes}
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                          <MessageCircle className="size-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-2xl lg:text-3xl text-foreground tracking-tight leading-tight mb-2 cursor-pointer hover:opacity-80 transition-opacity">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 text-xs font-medium border-border/50 bg-muted/20"
                      >
                        <Clock className="size-3 mr-1.5 opacity-70" />{" "}
                        {post.time}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 text-xs font-medium border-border/50 bg-muted/20"
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-center py-8">
                <Spinner className="text-primary size-8 animate-spin" />
              </div>
            )}
          </div>
        </main>

        {/* ========================================= */}
        {/* RIGHT SIDEBAR: GLASS WIDGETS              */}
        {/* ========================================= */}
        <aside className="lg:col-span-3 xl:col-span-3 hidden lg:block">
          <div className="sticky top-8 flex flex-col gap-6">
            {/* Widget 1: Minimalist Profile */}
            {user && (
              <div className="bg-muted/10 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-none mb-1">
                        {user.username}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Chef in Training
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-background/50 rounded-2xl py-3 px-4 flex flex-col justify-center border border-border/30">
                    <div className="font-bold text-xl text-foreground">12</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Saved
                    </div>
                  </div>
                  <div className="flex-1 bg-background/50 rounded-2xl py-3 px-4 flex flex-col justify-center border border-border/30">
                    <div className="font-bold text-xl text-foreground">3</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Cooked
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Widget 2: Recipe of the Day (Frameless) */}
            <div className="bg-muted/10 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 relative overflow-hidden group cursor-pointer">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles className="size-4 text-primary fill-primary/20" />
                <h3 className="text-xs font-bold tracking-[0.2em] text-foreground uppercase">
                  Featured
                </h3>
              </div>
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative z-10 shadow-md">
                <img
                  src="https://picsum.photos/seed/rotd/400/400"
                  alt="Recipe of the day"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight relative z-10">
                Brown Butter Scallops with Corn Purée
              </h4>
              <p className="text-xs text-muted-foreground mt-2 relative z-10">
                A masterclass in searing. • 45m
              </p>
            </div>

            {/* Widget 3: Technique Spotlight */}
            <div className="bg-card border border-border/50 rounded-[2rem] p-1 shadow-sm overflow-hidden group cursor-pointer">
              <div className="bg-muted/30 rounded-[1.75rem] p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-foreground uppercase">
                    Technique
                  </h3>
                </div>
                <h4 className="font-bold text-base text-foreground mb-1">
                  The Maillard Reaction
                </h4>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  Understand the science behind achieving the perfect, flavorful
                  crust on proteins.
                </p>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-primary">
                  <span>Start Lesson</span>
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Play className="size-3 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
