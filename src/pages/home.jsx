import Hero from "@/components/hero";
import { TrustedBy } from "@/components/trusted_by";
import Features from "@/components/features";
import { FinalCTA } from "@/components/final_cta";
import { FeatureWithIllustration } from "@/components/feature_with_illustration";
import { FAQ } from "@/components/faq";
import { ReviewsSection } from "@/components/reviews";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fadewrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn>
        <TrustedBy />
      </FadeIn>
      <FadeIn>
        <Features />
      </FadeIn>
      <FadeIn>
        <FeatureWithIllustration />
      </FadeIn>
      <FadeIn>
        <ReviewsSection />
      </FadeIn>
      <FadeIn>
        <FAQ />
      </FadeIn>
      <FadeIn>
        <FinalCTA />
      </FadeIn>
      <FadeIn>
        <Footer />
      </FadeIn>
    </main>
  );
}
