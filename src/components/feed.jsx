import { useState, useEffect, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, Heart, MessageCircle, Bookmark, ChefHat, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const fetchRecipesAPI = async (page, query, filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosts = Array.from({ length: 5 }).map((_, i) => ({
        id: `${page}-${i}-${Date.now()}`,
        author: `Chef_${Math.floor(Math.random() * 100)}`,
        title: query ? `${query} Recipe ${page}-${i}` : `Delicious Meal ${page}-${i}`,
        description: "A wonderful dish that brings out the best of our warm, organic color palette.",
        time: "45 mins",
        category: filters.category || "Dinner",
        likes: Math.floor(Math.random() * 500),
        image: `https://picsum.photos/seed/${page}${i}/600/400`,
      }));
      resolve({
        data: newPosts,
        hasMore: page < 5,
      });
    }, 800);
  });
};

export default function RecipeFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Expanded categories list to show off the new wrapping/scrolling behavior
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Vegan", "Liked", "Bookmarked", "High Protein", "Quick Prep"];

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
    [loading, hasMore]
  );

  const loadPosts = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const response = await fetchRecipesAPI(pageNum, searchQuery, { category: activeCategory });
      
      setPosts((prev) => {
        if (reset) return response.data;
        return [...prev, ...response.data];
      });
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* --- STICKY HEADER & FILTERS --- */}
      {/* Increased opacity and padding for a cleaner separation from the feed */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border pt-4 pb-3 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 md:px-0 flex flex-col gap-4">
          
          {/* Search Bar */}
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes, ingredients, or chefs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-6 bg-muted/30 border-border rounded-2xl focus-visible:ring-primary text-base transition-colors hover:bg-muted/50"
            />
            <Button size="icon" variant="ghost" className="absolute right-2 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl">
              <SlidersHorizontal className="size-5" />
            </Button>
          </div>

          {/* Filter Pills - Upgraded Design */}
          <div className="relative w-full">
            <div className="flex gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* --- THE FEED --- */}
      <div className="max-w-2xl mx-auto p-4 flex flex-col gap-8 mt-4">
        {posts.map((post, index) => {
          const isTriggerPost = posts.length === index + preloadOffset;

          return (
            <div
              key={post.id}
              ref={isTriggerPost ? triggerPostRef : null}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-up"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-lg">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground text-sm tracking-tight">{post.author}</h4>
                    <p className="text-xs text-muted-foreground font-medium">2 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
                  <ChefHat className="size-5" />
                </Button>
              </div>

              {/* Post Image */}
              <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy" 
                />
              </div>

              {/* Post Content & Actions */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors group">
                      <Heart className="size-6 group-hover:fill-destructive/20" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group">
                      <MessageCircle className="size-6 group-hover:fill-primary/20" />
                    </button>
                  </div>
                  <button className="text-muted-foreground hover:text-accent transition-colors group">
                    <Bookmark className="size-6 group-hover:fill-accent/20" />
                  </button>
                </div>

                <h3 className="font-bold text-xl mb-2 text-card-foreground tracking-tight">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground border-none hover:bg-muted/80 px-2.5 py-1">
                    <Clock className="size-3 mr-1.5" /> {post.time}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground border-none hover:bg-secondary/40 px-2.5 py-1">
                    {post.category}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner for the bottom */}
        {loading && (
          <div className="flex justify-center py-8">
            <Spinner className="text-primary size-8 animate-spin" />
          </div>
        )}

        {/* End of Feed Message */}
        {!hasMore && !loading && posts.length > 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground font-medium">You've seen all the recipes!</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Time to head to the kitchen.</p>
          </div>
        )}
      </div>
    </div>
  );
}