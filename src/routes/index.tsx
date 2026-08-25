import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/Hero";
import { FinalCTASection } from "~/components/FinalCTASection";
import { SectionDivider } from "~/components/SectionDivider";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] relative">
      {/* Noise Texture */}
      <div className="noise-overlay"></div>

      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--foreground),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--foreground),0.03)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <main className="flex-1 relative z-10">
        <Hero />
        <SectionDivider />
        <FinalCTASection />
      </main>
    </div>
  );
}
