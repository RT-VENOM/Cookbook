import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
export function FinalCTA() {
  const navigate = useNavigate() 
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to elevate your cooking?</h2>
        <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
          Join thousands of home chefs already mastering professional techniques. No fluff, just pure culinary education.
        </p>
        <Button size="lg" variant="secondary" className="h-12 px-10 text-lg" onClick={()=>{
          navigate(ROUTES.FEED)
        }}>
          Get Started for Free
        </Button>
      </div>
    </section>
  );
}