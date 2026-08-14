import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingTrust from "@/components/landing/LandingTrust";
import LandingBento from "@/components/landing/LandingBento";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingUseCases from "@/components/landing/LandingUseCases";
import LandingExamples from "@/components/landing/LandingExamples";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="landing-ambient flex min-h-screen flex-col text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingTrust />
        <LandingBento />
        <LandingHowItWorks />
        <LandingUseCases />
        <LandingExamples />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
